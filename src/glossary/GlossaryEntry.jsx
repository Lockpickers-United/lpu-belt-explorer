import React from 'react'
import Card from '@mui/material/Card'
import GlossaryImage from './GlossaryImage'

function GlossaryEntry({entry}) {

    const photoCredit = entry.media
        ? entry.media.title.charAt(0).toLowerCase() + entry?.media.title.slice(1)
        : ''


    return (
        <Card style={{
            maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: '12px 20px',
            borderRadius: 0
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

                {!!entry.media && ` (Photo ${photoCredit})`}
            </div>
        </Card>
    )
}

export default GlossaryEntry
