import React, {useContext, useState} from 'react'
import Button from '@mui/material/Button'
import {Collapse} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import changelogEntryFormat from './changelogEntryFormat.js'
import DataContext from '../context/DataContext.jsx'

export default function ChangelogPreviewButton({entry, currentAction}) {
    const [showPreview, setShowPreview] = useState(false)
    const {getLockFromId} = useContext(DataContext)
    const targetLock = currentAction.samelineLock && getLockFromId
        ? getLockFromId(currentAction.samelineLock.lockId) : null
    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Button variant='text' size='small' onClick={() => setShowPreview(!showPreview)}
                        color='success' style={{whiteSpace: 'nowrap', height: 32}}>{showPreview ? 'Hide' : ''} Preview</Button>
            </div>
            <Collapse in={showPreview} style={{padding: '0 12px', background: '#444'}}>
                <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]} remarkPlugins={[remarkGfm]}>
                    {changelogEntryFormat({entry, adminAction: currentAction, targetLock}).replace(/^-/g, '')}
                </ReactMarkdown>
            </Collapse>
        </div>
    )
}
