import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import projectsMd from '../resources/projects.md?raw'
import '../resources/md-tables.css'

export default function ProjectsPage() {

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16,
                padding: '0px 30px'
            }}>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                        target: '_blank',
                        rel: ['nofollow', 'noopener', 'noreferrer']
                    }]]} remarkPlugins={[remarkGfm]}>
                        {projectsMd}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}