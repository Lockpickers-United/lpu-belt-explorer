import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import GithubButton from '../nav/GithubButton'
import privacyPolicyMd from '../resources/privacyPolicy.md?raw'

function PrivacyPage() {
    const updateTime = 'November 28, 2023'
    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16
            }}>
                <CardHeader title='Privacy Policy' action={
                    <GithubButton url='https://github.com/Lockpickers-United/lpu-belt-explorer/blob/main/src/resources/privacyPolicy.md'/>
                }/>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                        {String(privacyPolicyMd)}
                    </ReactMarkdown>
                </CardContent>
                <CardActions>
                    Last Updated: {updateTime}
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

export default PrivacyPage
