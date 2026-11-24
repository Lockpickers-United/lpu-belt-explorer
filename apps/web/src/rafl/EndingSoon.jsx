import React from 'react'
import {useCountdown} from '../util/useCountdown.jsx'
import dayjs from 'dayjs'

export default function EndingSoon({entry}) {
    if (!entry.endDate) return null

    const {remaining, formattedTime} = useCountdown({endTime: entry.endDate ? dayjs(entry.endDate).valueOf() : undefined})

    if (remaining > 0) {
        return (
            <div style={{
                fontSize: '0.85rem', fontWeight: 700, marginLeft: 8, padding: '3px 6px',
                color: '#f54040', border: '#f54040 1px solid', textAlign: 'center', lineHeight: '1.2'
            }}>
                ENDS IN<br/>
                <span style={{whiteSpace: 'nowrap'}}>{formattedTime}</span>
            </div>
        )
    } else {
        return (
            <div style={{
                fontSize: '0.85rem', fontWeight: 700, marginLeft: 8, padding: '1px 6px',
                color: '#f54040', border: '#f54040 1px solid', textAlign: 'center'
            }}>
                ENDED
            </div>
        )

    }
}