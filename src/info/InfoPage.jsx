import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import GithubButton from '../nav/GithubButton'
import introMd from '../resources/intro.md?raw'
import infoMd from '../resources/info.md?raw'
import changelogMd from '../resources/changelog.md?raw'

function InfoPage() {
    const updateTime = '12/4/2023'

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16
            }}>
                <CardHeader title='Belt Requirements' action={
                    <GithubButton url='https://github.com/Lockpickers-United/lpu-belt-explorer/blob/main/src/resources/info.md'/>
                }/>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                        {markdown}
                    </ReactMarkdown>
                </CardContent>
                <CardActions>
                    Updated: {updateTime}
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

const markdown = [
    introMd,
    infoMd,
    changelogMd
].join('\n\n---\n\n')

export default InfoPage
