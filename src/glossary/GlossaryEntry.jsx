import React, {useCallback} from 'react'
import Card from '@mui/material/Card'
import useWindowSize from '../util/useWindowSize.jsx'

function GlossaryEntry({entry}) {

    const {width} = useWindowSize()
    const smallWidth = width < 500
    const photoWidth = !smallWidth ? 150 : 110

    return (
        <Card style={{
            maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: '20px 20px',
            borderTop: '1px solid #333', borderRadius: 0
        }}>
            <div style={{color: '#ddd'}}>
                {!!entry.media?.length &&
                    <div style={{
                        margin: '6px 0px 12px 20px', float: 'right',
                        textAlign: 'center', fontSize: '0.85rem'
                    }}>
                        <img alt={entry.term} src={entry.media[0].thumbnailUrl} style={{width: photoWidth}}/><br/>
                        <a href={null} style={{textDecoration: 'underline'}}>details</a>
                    </div>
                }
                <span style={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    marginBottom: 4,
                    color: '#fff'
                }}>{entry.term}</span> - {entry.definition}
                {!!entry.media?.length && ` (Photo ${entry.media[0].title})`}
            </div>
        </Card>
    )
}

export default GlossaryEntry
