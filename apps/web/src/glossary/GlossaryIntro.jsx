import Card from '@mui/material/Card'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import glossaryIntro from '../resources/glossaryIntro.md?raw'

function GlossaryIntro() {
    const cardStyle = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '6px 20px',
        borderBottom: '1px solid #333',
        borderTop: '1px solid #333',
        borderRadius: 0
    }

    return (
        <Card style={cardStyle}>
            <ReactMarkdown>
                {glossaryIntro}
            </ReactMarkdown>
        </Card>
    )
}

export default GlossaryIntro
