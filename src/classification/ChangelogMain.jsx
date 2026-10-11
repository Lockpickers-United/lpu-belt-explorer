import React, {useContext, useMemo} from 'react'
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

export default function ChangelogMain() {
    usePageTitle('Changelog')
    const {accessInfo} = useAccess()
    const {getAdminAction} = useContext(ClassificationContext)

    const {visibleChangelogEntries = [], getLockFromId} = useContext(DataContext)

    const mappedEntries = useMemo(() => visibleChangelogEntries.map(entry => {
        const adminAction = getAdminAction(entry)
        return {
            ...entry,
            adminAction,
        }
    }), [getAdminAction, visibleChangelogEntries])

    const groupedEntries = mappedEntries.reduce((acc, entry) => {
        const adminAction = getAdminAction(entry)
        if (adminAction.action === 'Sameline') {
            setDeepPush(acc, ['Samelines'], entry)
        } else if (adminAction.action === 'Delete') {
            setDeepPush(acc, ['Deleted'], entry)
        } else if (entry.belt === 'Unranked' && adminAction.action === 'Belt Change') {
            setDeepPush(acc, ['New Additions'], entry)
        } else if (compareBelts(entry.belt, adminAction.updatedBelt) === 1) {
            setDeepPush(acc, ['Downgrades'], entry)
        } else if (compareBelts(entry.belt, adminAction.updatedBelt) === -1) {
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

    let clipboardText = `**${dayjs().format('MMMM YYYY').toUpperCase()}**\n\n`
    sections.map((key) => {
            if (groupedEntries[key]?.length)
                clipboardText += `**${key.toUpperCase()}**\n\n${
                groupedEntries[key]
                    .map(entry => changelogEntryFormat({entry})).join('\n')
            }\n\n`
        }
    )

    const rows = sections.reduce((acc, key) => {
        if (groupedEntries[key]?.length) {
            groupedEntries[key].map(entry => {
                const name = entryName(entry, 'short')
                const version = entry.version

                const adminAction = getAdminAction(entry)
                const {id, action, samelineLock, note, adminNote} = adminAction

                const lock = samelineLock ? getLockFromId(samelineLock.lockId) : null
                const belt = adminAction.updatedBelt || lock?.belt || entry.belt ||null

                acc.push({
                    name,
                    version,
                    id: entry.id,
                    adminActionId: id,
                    action,
                    change: key.replace(/s$/, ''),
                    belt,
                    samelineTargetId: lock ? lock.id : null,
                    samelineTargetName: lock ? entryName(lock, 'short', {includeVersion: true}) : null,
                    samelineTargetBelt: lock ? lock.belt : null,
                    note,
                    adminNote,
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
            filename: `changelog-${dayjs().format('YYYY-MMM')}`,
            data: rows,
            csvHeaders,
            clipboardFormat: function (value) {
                return value.toString()
            },
            clipboardContent,
            formats: ['clipboard', 'csv', 'json'],
            textButton: !isMobile
        }
    }, [clipboardText, isMobile, rows])

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

    return (
        <React.Fragment>
            <Nav title='Changelog' extras={extras}/>
            <ClassificationToolbar/>

            {sections.map((key) => groupedEntries[key]?.length &&
                <div key={key} style={style}>
                    <div style={{fontSize: '1.4rem', fontWeight: 700}}>{key}</div>
                    {groupedEntries[key].map((entry) =>
                        <ChangelogEntry
                            key={entry.id}
                            entry={entry}
                        />
                    )}
                </div>
            )}

            <Footer extras={null} before={null} style={{marginTop: 40}}/>
            <Tracker feature='changelog'/>

        </React.Fragment>
    )
}
