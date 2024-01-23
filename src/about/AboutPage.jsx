import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React from 'react'
import ReactMarkdown from 'react-markdown'
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
                <CardContent>
                    <ReactMarkdown linkTarget="_blank">
                        {aboutMD}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default AboutPage