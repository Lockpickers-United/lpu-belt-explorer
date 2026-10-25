import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import GithubButton from '../nav/GithubButton'
import usageMd from '../resources/usage.md?raw'
import remarkGfm from 'remark-gfm'

function PrivacyPage() {
    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16
            }}>
                <CardHeader title='LPU Belt Explorer, Belt Ranking Content Usage' action={
                    <GithubButton url='https://github.com/Lockpickers-United/lpu-belt-explorer'/>
                }/>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                        target: '_blank',
                        rel: ['nofollow', 'noopener', 'noreferrer']
                    }]]} remarkPlugins={[remarkGfm]}>
                        {String(usageMd)}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default PrivacyPage
