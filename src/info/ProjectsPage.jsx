import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import GithubButton from '../nav/GithubButton'
import projectsMd from '../resources/projects.md?raw'
import '../resources/md-tables.css'

export default function ProjectsPage() {
    const updateTime = '7/23/2024'

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16
            }}>
                <CardHeader title="Master's Projects" />
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]} remarkPlugins={[remarkGfm]}>
                        {projectsMd}
                    </ReactMarkdown>
                </CardContent>
                <CardActions>
                    Updated: {updateTime}
                </CardActions>
            </Card>
        </React.Fragment>
    )
}