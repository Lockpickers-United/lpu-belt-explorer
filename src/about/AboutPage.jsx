import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import aboutMD from '../resources/about.md?raw'
import infoMd from '../resources/info.md?raw'
import changelogMd from '../resources/changelog.md?raw'

function AboutPage() {
    const updateTime = '12/4/2023'

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 700,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16
            }}>
                <CardContent>
                    <ReactMarkdown linkTarget="_blank">
                        {markdown}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

const markdown = [
    aboutMD
].join('\n\n---\n\n')

export default AboutPage
