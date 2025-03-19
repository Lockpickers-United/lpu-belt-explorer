import React from 'react'
import introCopyData from '../data/introCopy.json'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'

export default function IntroCopy({pageName, maxWidth = 700}) {
    const navigate = useNavigate()
    const intro = introCopyData[pageName]

    if (intro) {
        return (
            <div style={{
                maxWidth: maxWidth,
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: '0px 8px 20px 8px',
                fontSize: '1rem',
                lineHeight: '1.35rem'
            }}>
                <div style={{fontSize:'1.2rem', fontWeight:600}}>{intro.title}</div>
                <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                    target: '_blank',
                    rel: ['nofollow', 'noopener', 'noreferrer']
                }]]} remarkPlugins={[remarkGfm]}>
                    {intro.copy}
                </ReactMarkdown>
                {intro.link && intro.destination &&
                    <React.Fragment>
                        &nbsp;<Link onClick={() => {
                        navigate(intro.destination)
                    }} style={{color: '#aaa', cursor: 'pointer'}}>{intro.link}</Link>
                    </React.Fragment>
                }
            </div>
        )
    }
}