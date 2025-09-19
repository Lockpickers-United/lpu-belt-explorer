import React, {useState, useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Drawer from '@mui/material/Drawer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import '../resources/md-tables.css'

import {pageData} from './pageData'

export default function ViewPageDrawer({pageId}) {

    const [overlayIsOpen, setOverlayIsOpen] = useState(false)
    const handleOverlayOpen = useCallback(() => {
        setOverlayIsOpen(true)
    }, [])
    const handleOverlayClose = useCallback(() => {
        setOverlayIsOpen(false)
    }, [])

    return (
        <React.Fragment>
            <IconButton onClick={handleOverlayOpen} style={{marginRight: 0}}>
                <HelpOutlineIcon fontSize='small'/>
            </IconButton>
            <Drawer
                sx={{color: '#fff', textAlign: 'left', height: 700, zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={overlayIsOpen} onClick={handleOverlayClose}
            >

                <div style={{maxWidth: 600, fontSize: '0.95rem', padding: 15}}>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{fontSize: '1.3rem', fontWeight: 700, flexGrow: 1}}>
                        {pageData[pageId]?.title}
                    </div>
                    <IconButton onClick={handleOverlayClose}>
                        <HighlightOffIcon sx={{cursor: 'pointer'}}/>
                    </IconButton>
                 </div>

                <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                    target: '_blank',
                    rel: ['nofollow', 'noopener', 'noreferrer']
                }]]} remarkPlugins={[remarkGfm]}>
                    {pageData[pageId]?.content || 'Page Not Found'}
                </ReactMarkdown>

            </div>

        </Drawer>
</React.Fragment>
)

}