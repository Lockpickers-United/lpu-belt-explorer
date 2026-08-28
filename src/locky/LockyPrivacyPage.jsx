import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import privacyPolicyMd from './lockyPrivacyPolicy.md?raw'

function LockyPrivacyPage() {
    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16
            }}>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                        {String(privacyPolicyMd)}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default LockyPrivacyPage
