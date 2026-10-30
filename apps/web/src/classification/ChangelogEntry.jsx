import React, {useCallback, useContext, useState} from 'react'
import BeltStripe from '../entries/BeltStripe'
import entryName from '../entries/entryName'
import ClassificationContext from '../app/ClassificationContext.jsx'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import changelogEntryFormat from './changelogEntryFormat.js'
import DataContext from '../context/DataContext.jsx'
import Button from '@mui/material/Button'
import {Collapse, useTheme} from '@mui/material'
import EntryClassificationAdmin from './EntryClassificationAdmin.jsx'
import {useAccess} from '../app/AccessContext.jsx'
import Checkbox from '@mui/material/Checkbox'
import useClassificationCommand from './useClassificationCommand.js'
import {canPublishClassification} from './writeStage.js'
import {Link, useNavigate} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

function ChangelogEntry({entry, historical = false, publicationId, reloadChangelog}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const {accessInfo} = useAccess()
    const {getAdminAction} = useContext(ClassificationContext)
    const {getLockFromId} = useContext(DataContext)
    const [showEdit, setShowEdit] = useState(false)
    const {run, pending, error} = useClassificationCommand()

    const adminAction = entry.adminAction ?? getAdminAction(entry)

    console.log('adminAction', adminAction)

    const targetId = adminAction?.samelineTargetId ?? adminAction?.samelineLock?.lockId
    const targetLock = !historical && targetId ? getLockFromId(targetId) : null

    const pub = entry.publishedAction ?? null

    const toggleApproved = async () => {
        try {
            await run('patch', `publications/${encodeURIComponent(publicationId)}/actions/${encodeURIComponent(pub.actionId)}/approval`,
                {approved: !pub.approved})
            reloadChangelog?.()
        } catch {
            // Keep the saved value visible and show the command error below.
        }
    }

    const openInNewTab = useCallback((id) => {
        const link = `https://lpubelts.com/#/locks?tab=search&search=${id}&id=${id}}`
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    const idBlock = adminAction.newSamelineName
        ? <><span style={{fontWeight: 700}}>new</span> =&gt; <Link onClick={() => openInNewTab(entry.id)} to={null}>{entry.id}</Link></>
        : adminAction.samelineTargetId
            ? <><Link onClick={() => openInNewTab(entry.id)} to={null}>{entry.id}</Link> =&gt; <Link onClick={() => openInNewTab(targetId)} to={null}>{targetId}</Link></>
            : <Link onClick={() => openInNewTab(entry.id)} to={null}>{entry.id}</Link>

    const color = pub?.approved
        ? pub?.result?.mismatch
            ? theme.palette.warning.light
            : '#999'
        : 'inherit'

    const actionAudit = pub
        ? <div style={{display: 'flex', alignItems: 'center', gap: 1, marginLeft: 16, paddingBottom: 8}}>
            <Checkbox size='small' color='success'
                      checked={pub.approved === true} onChange={toggleApproved}
                      disabled={!accessInfo.roles.classificationAdmin || !canPublishClassification || pending}/>
            <div style={{fontSize: '0.85rem', paddingTop: 3, color: color}}>
                {pub.result?.status} — {pub.result?.detail} ({idBlock})
            </div>
            {error && <div role='alert'>Could not update approval: {error.message}</div>}
        </div>
        : null

    const name = historical ? adminAction.entryName ?? entryName(entry, 'short') : entryName(entry, 'short')
    const belt = adminAction.updatedBelt || targetLock?.belt || adminAction.samelineLock?.belt ||
        (historical ? adminAction.previousBelt ?? entry.belt : entry.belt)

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#222'}

    return (
        <div style={style} aria-label={name}>
            <div style={{alignItems: 'center', position: 'relative', paddingLeft: 12, marginTop: 16, width: '100%'}}>
                <BeltStripe value={belt}/>
                <div style={{
                    margin: '8px 16px',
                    padding: '6px 0',
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'top',
                    width: '100%'
                }}>
                    <div style={{width: '100%', flexGrow: 1}}>
                        <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}
                                       remarkPlugins={[remarkGfm]}
                                       components={{p: 'div'}}
                        >
                            {changelogEntryFormat({
                                entry,
                                adminAction,
                                targetLock,
                                linebreak: true,
                                historical
                            }).replace(/^-/g, '')}
                        </ReactMarkdown>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: 16}}>
                        <IconButton onClick={() => navigate(`/locks?tab=search&search=${entry.id}&id=${entry.id}`)}
                                    style={{height: 40, marginRight: 8}}>
                            <OpenInNewIcon style={{color: '#ccc'}}/>
                        </IconButton>
                    </div>

                </div>
                {accessInfo.roles.classificationAdmin && !historical &&
                    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: 16}}>
                        <Button onClick={() => setShowEdit(!showEdit)} variant='text' size='small'
                                style={{color: '#e16936'}}>{!showEdit ? 'Edit' : 'Cancel'}</Button>
                    </div>
                }
                {accessInfo.roles.classificationAdmin && actionAudit}
            </div>
            <Collapse in={showEdit && !historical} style={{marginTop: 16, backgroundColor: '#292929'}} unmountOnExit>
                {showEdit && !historical &&
                    <EntryClassificationAdmin entry={entry}/>
                }
            </Collapse>
        </div>
    )
}

export default React.memo(ChangelogEntry)
