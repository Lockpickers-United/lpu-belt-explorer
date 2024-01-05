import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import privacyPolicyMd from '../resources/privacyPolicy.md?raw'

function PrivacyPage() {
    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16
            }}>
                <CardContent>
                    <ReactMarkdown linkTarget="_blank">
                        {privacyPolicyMd}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default PrivacyPage
