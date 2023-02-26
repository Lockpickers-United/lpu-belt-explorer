import React from 'react'
import {LinearProgress} from '@mui/material'

function Progress({value}) {
    const percent = Math.round(value * 100)

    if (percent === 100) return null
    return (
        <LinearProgress
            value={percent}
            variant='determinate'
            color='secondary'
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10000
            }}
        />
    )
}

export default Progress
