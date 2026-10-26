import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import GithubButton from '../nav/GithubButton'
import dansMd from '../resources/dans.md?raw'
import '../resources/md-tables.css'

function DansPage() {
    const updateTime = '1/23/2024'

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16
            }}>
                <CardHeader title='Dan System' action={
                    <GithubButton url='https://github.com/Lockpickers-United/lpu-belt-explorer/blob/main/src/resources/dans.md'/>
                }/>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]} remarkPlugins={[remarkGfm]}>
                        {String(dansMd)}
                    </ReactMarkdown>
                </CardContent>
                <CardActions>
                    Updated: {updateTime}
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

export default DansPage
