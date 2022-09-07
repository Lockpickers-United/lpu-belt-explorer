import React from 'react'
import IconButton from '@mui/material/IconButton'
import LPUImage from './resources/LPU.png'

function LPUButton() {
    return (
        <IconButton
            edge='start' color='inherit' size='medium' sx={{mr: 2}}
            href='https://www.lockpickersunited.org/beltsystem/belts/'
            target='_blank' rel='noopener noreferrer'
        >
            <img alt='LPU' src={LPUImage} width={36} height={36}/>
        </IconButton>
    )
}

export default LPUButton
