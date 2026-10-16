import React, {useContext, useState} from 'react'
import BeltStripe from '../entries/BeltStripe'
import entryName from '../entries/entryName'
import ClassificationContext from '../app/ClassificationContext.jsx'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import changelogEntryFormat from './changelogEntryFormat.js'
import DataContext from '../context/DataContext.jsx'
import Button from '@mui/material/Button'
import {Collapse} from '@mui/material'
import EntryClassificationAdmin from './EntryClassificationAdmin.jsx'
import {useAccess} from '../app/AccessContext.jsx'

function ChangelogEntry({entry, historical = false}) {
    const {accessInfo} = useAccess()
    const {getAdminAction} = useContext(ClassificationContext)
    const {getLockFromId} = useContext(DataContext)

    const adminAction = entry.adminAction ?? getAdminAction(entry)
    const targetId = adminAction?.samelineTargetId ?? adminAction?.samelineLock?.lockId
    const targetLock = !historical && targetId ? getLockFromId(targetId) : null

    const [showEdit, setShowEdit] = useState(false)

    // sameline with Gera 3000 on BLUE
    const name = historical ? adminAction.entryName ?? entryName(entry, 'short') : entryName(entry, 'short')
    const belt = adminAction.updatedBelt || targetLock?.belt || adminAction.samelineLock?.belt ||
        (historical ? adminAction.previousBelt ?? entry.belt : entry.belt)

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#222'}

    return (
        <div style={style} aria-label={name}>
            <div style={{alignItems: 'center', position: 'relative', paddingLeft: 12, marginTop: 16}}>
                <BeltStripe value={belt}/>
                <div style={{
                    margin: '8px 16px',
                    padding: '6px 0',
                    flexShrink: 0,
                    flexDirection: 'column'
                }}>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}
                                   remarkPlugins={[remarkGfm]}
                                   components={{p: 'div'}}
                    >
                        {changelogEntryFormat({entry, adminAction, targetLock, linebreak: true, historical}).replace(/^-/g, '')}
                    </ReactMarkdown>
                </div>
                {accessInfo.roles.classificationAdmin && !historical &&
                    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: 16}}>
                        <Button onClick={() => setShowEdit(!showEdit)} variant='text' size='small'
                                style={{color: '#e16936'}}>{!showEdit ? 'Edit' : 'Cancel'}</Button>
                    </div>
                }
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
