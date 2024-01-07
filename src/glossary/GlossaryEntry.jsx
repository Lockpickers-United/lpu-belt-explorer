import React from 'react'
import Card from '@mui/material/Card'
import GlossaryImage from './GlossaryImage'

function GlossaryEntry({entry}) {
    return (
        <Card style={{
            maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: '20px 20px',
            borderTop: '1px solid #333', borderRadius: 0
        }}>
            <div style={{color: '#ddd'}}>
                <GlossaryImage entry={entry}/>

                <span style={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    marginBottom: 4,
                    color: '#fff'
                }}>{entry.term}.&nbsp;</span>

                {entry.definition}

                {!!entry.media && ` (Photo ${entry.media.title})`}
            </div>
        </Card>
    )
}

export default GlossaryEntry
