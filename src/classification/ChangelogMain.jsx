import React, {useCallback, useContext, useId, useMemo} from 'react'
import {useSearchParams} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'
import DataContext from '../context/DataContext.jsx'
import Nav from '../nav/Nav.jsx'
import Tracker from '../app/Tracker.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import ChangelogEntry from './ChangelogEntry.jsx'
import {setDeepPush} from '../util/setDeep.js'
import ClassificationContext from '../app/ClassificationContext.jsx'
import {compareBelts} from '../data/belts.js'
import entryName from '../entries/entryName.js'
import dayjs from 'dayjs'
import ExportButtonGeneric from '../misc/ExportButtonGeneric.jsx'
import Button from '@mui/material/Button'
import ClassificationToolbar from './ClassificationToolbar.jsx'
import Tooltip from '@mui/material/Tooltip'
import {useAccess} from '../app/AccessContext.jsx'
import Footer from '../nav/Footer.jsx'
import changelogEntryFormat from './changelogEntryFormat.js'
import Paper from '@mui/material/Paper'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import classificationCatalog from '../data/classification-catalog.json'
import reconcileClassificationAction from './reconcileClassificationAction.js'
import ErrorMessage from '../misc/ErrorMessage.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import useClassificationCommand from './useClassificationCommand.js'
import {canPublishClassification} from './writeStage.js'
import {getLockSortComparator} from '../locks/lockSortComparators.js'
import {enqueueSnackbar} from 'notistack'
import {pluralize} from '../util/stringUtils.js'
import ConfirmButton from '../misc/ConfirmButton.jsx'

const catalogById = new Map(classificationCatalog.entries.map(entry => [entry.id, entry]))

export default function ChangelogMain() {
    usePageTitle('Changelog')

    const {accessInfo} = useAccess()
    const {
        getAdminAction,
        previousChangelogs,
        selectedPublication,
        stagedActions = [],
        changelogLoading,
        changelogError,
        reloadChangelog
    } = useContext(ClassificationContext)
    const {run, pending, error: publishError} = useClassificationCommand()
    const [searchParams, setSearchParams] = useSearchParams()

    const {getLockFromId, visibleChangelogEntries = []} = useContext(DataContext)

    const selectedChangelog = previousChangelogs.find(log => log.id === searchParams.get('id'))

    const publishedActions = useMemo(() => selectedPublication
        ? selectedPublication.actions.reduce((acc, action) => {
            const result = reconcileClassificationAction(action, catalogById) ?? {}
            acc[action.entryId] = {
                ...action,
                status: result.status,
                result
            }
            return acc
        }, {})
        : {}
    , [selectedPublication])

    const currentChangelogEntries = useMemo(() => {
        if (selectedChangelog) {
            return selectedChangelog.changes.map(action => {
                const lock = getLockFromId(action.entryId)
                return {
                    ...lock,
                    id: action.entryId,
                    belt: action.updatedBelt ?? lock?.belt ?? action.previousBelt,
                    adminAction: action,
                    publishedAction: publishedActions[action.entryId]
                }
            })
        }
        return visibleChangelogEntries.map(entry => {
            const adminAction = getAdminAction(entry) ?? {}
            const targetLock = getLockFromId(adminAction.samelineTargetId)
            return {
                ...entry,
                belt: targetLock?.belt ?? adminAction?.updatedBelt ?? entry?.belt ?? entry.previousBelt,
                adminAction: getAdminAction(entry)
            }
        })
            .filter(entry => entry.adminAction)
    }, [getAdminAction, getLockFromId, publishedActions, selectedChangelog, visibleChangelogEntries])

    currentChangelogEntries.sort(getLockSortComparator('beltDescending'))

    const groupedEntries = currentChangelogEntries.reduce((acc, entry) => {
        const {adminAction = {}} = entry
        if (adminAction.action === 'Delete') {
            setDeepPush(acc, ['Deleted'], entry)
        } else if ([adminAction.previousBelt, entry.belt, entry.assignedBelt].some(belt => belt === 'Unranked') && adminAction.action === 'Belt Change') {
            setDeepPush(acc, ['New Additions'], entry)
        } else if (['Sameline', 'Add New Sameline'].includes(adminAction.action)) {
            setDeepPush(acc, ['Samelines'], entry)
        } else if (adminAction.action === 'Other') {
            setDeepPush(acc, ['Other'], entry)
        } else if (compareBelts(adminAction.previousBelt ?? entry.belt, adminAction.updatedBelt) === 1) {
            setDeepPush(acc, ['Downgrades'], entry)
        } else if (compareBelts(adminAction.previousBelt ?? entry.belt, adminAction.updatedBelt) === -1) {
            setDeepPush(acc, ['Upgrades'], entry)
        } else {
            setDeepPush(acc, ['Other'], entry)
        }
        return acc
    }, {})

    const sections = ['New Additions', 'Samelines', 'Upgrades', 'Downgrades', 'Deleted', 'Other']

    // CES SP6 - GREEN. This is somewhat similar to the 6-pin PXM but with a different profile.
    // ABUS E100 - sameline with ABUS Ti12 on ORANGE, this is the same lock.
    const {isMobile} = useWindowSize()
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', marginTop: 24, padding: '0 8px'}

    const exportDate = selectedChangelog ? dayjs(selectedChangelog.lastPublishedAt) : dayjs()
    let clipboardText = `**${exportDate.format('MMMM YYYY').toUpperCase()}**\n\n`
    sections.map((key) => {
            if (groupedEntries[key]?.length)
                clipboardText += `**${key.toUpperCase()}**\n\n${
                    groupedEntries[key]
                        .map(entry => {
                            const {adminAction = {}} = entry
                            const targetId = adminAction.samelineTargetId ?? adminAction.samelineLock?.lockId
                            const targetLock = !selectedChangelog && targetId ? getLockFromId(targetId) : null
                            return changelogEntryFormat({
                                entry,
                                adminAction,
                                targetLock,
                                historical: Boolean(selectedChangelog)
                            })
                        }).join('\n')
                }\n\n`
        }
    )

    const rows = sections.reduce((acc, key) => {
        if (groupedEntries[key]?.length) {
            groupedEntries[key].map(entry => {
                const name = selectedChangelog ? entry.adminAction.entryName ?? entryName(entry, 'short') : entryName(entry, 'short')
                const version = entry.version

                const {adminAction = {}} = entry
                const {
                    id, actionId, action, samelineLock, samelineTargetId, samelineTargetName, newSamelineName,
                    note, adminNote
                } = adminAction

                const lock = !selectedChangelog && (samelineTargetId ?? samelineLock?.lockId)
                    ? getLockFromId(samelineTargetId ?? samelineLock.lockId) : null
                const belt = adminAction.updatedBelt || lock?.belt || samelineLock?.belt ||
                    (selectedChangelog ? adminAction.previousBelt ?? entry.belt : entry.belt) || null

                acc.push({
                    name,
                    version,
                    id: entry.id,
                    adminActionId: id ?? actionId,
                    action,
                    change: action === 'Add New Sameline' ? action : key.replace(/s$/, ''),
                    belt,
                    samelineTargetId: lock?.id ?? samelineTargetId ?? samelineLock?.lockId ?? null,
                    samelineTargetName: lock ? entryName(lock, 'short', {includeVersion: true}) : samelineTargetName ?? samelineLock?.lockFullName ?? null,
                    samelineTargetBelt: lock?.belt ?? samelineLock?.belt ?? null,
                    newSamelineName: newSamelineName ?? null,
                    note,
                    adminNote
                })
            })
        }
        return acc
    }, [])

    const exportData = useMemo(() => {
        const csvHeaders = [
            {name: 'Lock'},
            {version: 'Version'},
            {id: 'ID'},
            {change: 'Change Type'},
            {belt: 'Belt'},
            {samelineTargetName: 'Sameline Target'},
            {samelineTargetId: 'Sameline Target ID'},
            {newSamelineName: 'New Sameline Name'},
            {note: 'Note'}
        ]

        const clipboardContent = clipboardText

        return {
            filename: `changelog-${exportDate.format('YYYY-MMM')}`,
            data: rows,
            csvHeaders,
            clipboardFormat: function (value) {
                return value.toString()
            },
            clipboardContent,
            formats: ['clipboard', 'csv', 'json'],
            textButton: !isMobile
        }
    }, [clipboardText, exportDate, isMobile, rows])

    const publishable = stagedActions.filter(action => action.status === 'Staged' && !action.omitChangelog)
    const publishBatch = async () => {
        const actions = publishable.slice(0, 50).map(action => ({
            actionId: action.id, expectedRevision: action.revision
        }))
        try {
            const result = await run('post', 'publications', {actions})
            enqueueSnackbar('Changes published.', {variant: 'success'})
            reloadChangelog?.()
            setSearchParams(params => {
                params.set('id', result.publication.id)
                return params
            })
        } catch {
            // Keep the selected action revisions and retry key available.
        }
    }

    const extras = (
        <div style={{display: 'flex', marginTop: 6, alignItems: 'center', marginRight: 24}}>
            <div style={{flexGrow: 1, minWidth: !isMobile ? 10 : 0}}/>
            {accessInfo.roles.classificationAdmin &&
                <>
                    <ExportButtonGeneric exportData={exportData} clipboardContent={clipboardText}/>
                    <Tooltip
                        title={publishable.length > 50 ? 'Publish the first 50 staged changes' : 'Publish staged changes'}
                        arrow disableFocusListener>
                        <ConfirmButton variant='outlined' size='small' color='success'
                                       message={`About to publish ${publishable.length > 50 ? 'first 50' : publishable.length} ${pluralize('change', publishable.length)}.`}
                                       disabled={!canPublishClassification || Boolean(selectedChangelog) || !publishable.length || pending}
                                       style={{height: 32, marginLeft: 16}}
                                       onClick={publishBatch}>
                            Publish{publishable.length > 50 ? ' first 50' : ''}
                        </ConfirmButton>
                    </Tooltip>
                </>
            }
        </div>
    )

    const id = useId()
    const buttonId = `${id}-button`
    const menuId = `${id}-menu`
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleMenuClick = useCallback((changelogId) => {
        if (!changelogId) {
            setSearchParams(searchParams => {
                searchParams.delete('id')
                return searchParams
            })
        }
        if (changelogId && previousChangelogs.find(c => c.id === changelogId)) {
            setSearchParams(searchParams => {
                searchParams.set('id', changelogId)
                return searchParams
            })
        }
        setAnchorEl(null)
    }, [previousChangelogs, setSearchParams])

    const title = selectedChangelog
        ? dayjs(selectedChangelog.lastPublishedAt).format('MMMM D, YYYY').toUpperCase()
        : accessInfo.roles.classificationAdmin ? 'STAGED CHANGES' : 'APPROVED CHANGES'

    return (
        <React.Fragment>
            <Nav title='Changelog' extras={extras}/>
            <ClassificationToolbar/>
            {pending && <div role='status'>Publishing classification changes…</div>}
            {publishError && <div role='alert'>Could not publish classification changes: {publishError.message}
                {publishError.status === 409 && ' Reload the staged changes before trying again.'}</div>}
            {changelogError && <ErrorMessage errorMessage='Could not load the classification changelog.'/>}
            <Paper style={{...style, display: 'flex', justifyContent: 'space-between', padding: 8, gap: 8}}>
                <div style={{fontSize: '1.3rem', fontWeight: 600, marginTop: 3}}>{title}</div>
                <div>
                    <Button
                        id={buttonId}
                        aria-controls={open ? menuId : undefined}
                        aria-haspopup='true'
                        aria-expanded={open}
                        onClick={handleClick}
                        variant='text'
                        color='inherit'
                        style={{whiteSpace: 'nowrap'}}
                    >
                        {!isMobile ? 'View Previous Changelogs' : 'View Previous'}
                    </Button>
                    <Menu
                        id={menuId}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        sx={{'.MuiMenuItem-root': {minHeight: '36px', minWidth: '210px'}}}
                        slotProps={{list: {'aria-labelledby': buttonId}}}
                    >
                        <MenuItem key={'staged'} onClick={() => handleMenuClick()}
                                  style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{color: !selectedChangelog ? '#42d736' : 'inherit'}}>Current Changes</div>
                            <div style={{
                                minWidth: '20px',
                                color: !selectedChangelog ? '#42d736' : '#aaa',
                                textAlign: 'center'
                            }}>{visibleChangelogEntries.length}</div>
                        </MenuItem>
                        {previousChangelogs.map((entry) => (
                            <MenuItem key={entry.id}
                                      selected={selectedChangelog?.id === entry.id}
                                      onClick={() => handleMenuClick(entry.id)}
                                      style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{color: selectedChangelog?.id === entry.id ? '#42d736' : 'inherit'}}>
                                    {dayjs(entry.lastPublishedAt).format('MMMM D, YYYY')}
                                </div>
                                <div style={{
                                    minWidth: '20px',
                                    color: selectedChangelog?.id === entry.id ? '#42d736' : '#aaa',
                                    textAlign: 'center'
                                }}>{entry.actionCount ?? entry.changes.length}</div>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </Paper>

            {changelogLoading &&
                <LoadingDisplay message='Loading classification changes' style={{margin: '30px 0 100px'}}/>
            }

            {!changelogLoading && !changelogError && currentChangelogEntries.length === 0 &&
                <Paper style={{...style, marginTop: 8, display: 'flex', justifyContent: 'space-between', padding: 16}}>
                    No changes found. Admins will stage updates here as they are approved.
                    Use the "View Previous Changelogs" button to see past changes.
                </Paper>
            }

            {!changelogLoading && sections.map((key) => groupedEntries[key]?.length &&
                <div key={key} style={style}>
                    <div style={{fontSize: '1.3rem', fontWeight: 700}}>{key}</div>
                    {groupedEntries[key].map((entry) =>
                        <div key={entry.id}>
                            <ChangelogEntry
                                entry={entry}
                                historical={Boolean(selectedChangelog)}
                                publicationId={selectedPublication?.id}
                                reloadChangelog={reloadChangelog}
                            />
                        </div>
                    )}
                </div>
            )}

            <Footer extras={null} before={null} style={{marginTop: 40}}/>
            <Tracker feature='changelog'/>

        </React.Fragment>
    )
}
