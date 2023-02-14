import React from 'react'
import IconButton from '@mui/material/IconButton'

function LPUButton() {
    return (
        <IconButton
            edge='start' color='inherit' size='medium' sx={{mr: 1}}
            href='https://www.lockpickersunited.org/beltsystem/belts/'
            target='_blank' rel='noopener noreferrer'
        >
            <img alt='LPU' src='https://images.lpubelts.com/i/LPU-f691d3fe.png' width={36} height={36}/>
        </IconButton>
    )
}

export default LPUButton
