import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import GithubButton from '../nav/GithubButton'
import aboutMD from '../resources/about.md?raw'

function AboutPage() {
    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 700,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16
            }}>
                <CardHeader title='About LPU Belts' action={
                    <GithubButton url='https://github.com/Lockpickers-United/lpu-belt-explorer/blob/main/src/resources/about.md'/>
                }/>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                        {aboutMD}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default AboutPage
