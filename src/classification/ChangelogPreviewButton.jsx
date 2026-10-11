import React, {useState} from 'react'
import Button from '@mui/material/Button'
import {Collapse} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import changelogEntryFormat from './changelogEntryFormat.js'

export default function ChangelogPreviewButton({entry, currentAction}) {

    const [showPreview, setShowPreview] = useState(false)
    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Button variant='text' size='small' onClick={() => setShowPreview(!showPreview)}
                        color='success' style={{whiteSpace: 'nowrap', height: 32}}>{showPreview ? 'Hide' : ''} Preview</Button>
            </div>
            <Collapse in={showPreview} style={{padding: '0 12px', background: '#444'}}>
                <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]} remarkPlugins={[remarkGfm]}>
                    {changelogEntryFormat({entry, currentAction}).replace(/^-/g, '')}
                </ReactMarkdown>
            </Collapse>
        </div>
    )
}