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

export default function ChangelogMain() {
    usePageTitle('Changelog')

    const {accessInfo} = useAccess()
    const {getAdminAction, previousChangelogs} = useContext(ClassificationContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const {getLockFromId, visibleChangelogEntries = []} = useContext(DataContext)

    const selectedChangelog = previousChangelogs.find(log => log.id === searchParams.get('id'))

    const currentChangelogEntries = useMemo(() => {
        if (selectedChangelog) {
            return selectedChangelog.changes.map(action => {
                const lock = getLockFromId(action.entryId)
                return {
                    ...lock,
                    id: action.entryId,
                    belt: lock?.belt ?? action.previousBelt,
                    adminAction: action
                }
            })
        }
        return visibleChangelogEntries.map(entry => ({
            ...entry,
            adminAction: getAdminAction(entry)
        }))
    }, [getAdminAction, getLockFromId, selectedChangelog, visibleChangelogEntries])

    const groupedEntries = currentChangelogEntries.reduce((acc, entry) => {
        const {adminAction = {}} = entry
        if (adminAction.action === 'Delete') {
            setDeepPush(acc, ['Deleted'], entry)
        } else if ((adminAction.previousBelt ?? entry.belt) === 'Unranked' && adminAction.action === 'Belt Change') {
            setDeepPush(acc, ['New Additions'], entry)
        } else if (adminAction.action === 'Sameline') {
            setDeepPush(acc, ['Samelines'], entry)
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

    const exportDate = selectedChangelog ? dayjs(selectedChangelog.publishedAt) : dayjs()
    let clipboardText = `**${exportDate.format('MMMM YYYY').toUpperCase()}**\n\n`
    sections.map((key) => {
            if (groupedEntries[key]?.length)
                clipboardText += `**${key.toUpperCase()}**\n\n${
                    groupedEntries[key]
                        .map(entry => {
                            const {adminAction = {}} = entry
                            const targetLock = !selectedChangelog && adminAction.samelineLock
                                ? getLockFromId(adminAction.samelineLock.lockId) : null
                            return changelogEntryFormat({entry, adminAction, targetLock, historical: Boolean(selectedChangelog)})
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
                const {id, action, samelineLock, note, adminNote} = adminAction

                const lock = samelineLock && !selectedChangelog ? getLockFromId(samelineLock.lockId) : null
                const belt = adminAction.updatedBelt || samelineLock?.belt ||
                    (selectedChangelog ? adminAction.previousBelt ?? entry.belt : entry.belt) || null

                acc.push({
                    name,
                    version,
                    id: entry.id,
                    adminActionId: id,
                    action,
                    change: key.replace(/s$/, ''),
                    belt,
                    samelineTargetId: lock?.id ?? samelineLock?.lockId ?? null,
                    samelineTargetName: lock ? entryName(lock, 'short', {includeVersion: true}) : samelineLock?.lockFullName ?? null,
                    samelineTargetBelt: lock?.belt ?? samelineLock?.belt ?? null,
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

    const extras = (
        <div style={{display: 'flex', marginTop: 6, alignItems: 'center', marginRight: 24}}>
            <div style={{flexGrow: 1, minWidth: !isMobile ? 10 : 0}}/>
            {accessInfo.roles.classificationAdmin &&
                <>
                    <ExportButtonGeneric exportData={exportData} clipboardContent={clipboardText}/>
                    <Tooltip title={'Publish coming soon'} arrow disableFocusListener>
                        <Button variant='contained' color='success' size='small'
                                style={{height: 32, marginLeft: 16}}>Publish</Button>
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
        ? dayjs(selectedChangelog.publishedAt).format('MMMM D, YYYY').toUpperCase()
        : accessInfo.roles.classificationAdmin ? 'STAGED CHANGES' : 'APPROVED CHANGES'

    return (
        <React.Fragment>
            <Nav title='Changelog' extras={extras}/>
            <ClassificationToolbar/>
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
                                    {dayjs(entry.publishedAt).format('MMMM D, YYYY')}
                                </div>
                                <div style={{
                                    minWidth: '20px',
                                    color: selectedChangelog?.id === entry.id ? '#42d736' : '#aaa',
                                    textAlign: 'center'
                                }}>{entry.changes.length}</div>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </Paper>

            {currentChangelogEntries.length === 0 &&
                <Paper style={{...style, marginTop: 8, display: 'flex', justifyContent: 'space-between', padding: 16}}>
                    No changes found. Admins will stage updates here as they are approved.
                    Use the "View Previous Changelogs" button to see past changes.
                </Paper>
            }

            {sections.map((key) => groupedEntries[key]?.length &&
                <div key={key} style={style}>
                    <div style={{fontSize: '1.3rem', fontWeight: 700}}>{key}</div>
                    {groupedEntries[key].map((entry) =>
                        <ChangelogEntry
                            key={entry.id}
                            entry={entry}
                            historical={Boolean(selectedChangelog)}
                        />
                    )}
                </div>
            )}

            <Footer extras={null} before={null} style={{marginTop: 40}}/>
            <Tracker feature='changelog'/>

        </React.Fragment>
    )
}
