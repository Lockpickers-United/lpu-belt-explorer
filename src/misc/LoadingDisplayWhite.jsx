import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import {circularProgressClasses} from '@mui/material'

export default function LoadingDisplayWhite() {

    return (
        <div style={{display: 'flex', placeItems: 'center', width: 40, height: 40}}>
            <CircularProgress
                variant='indeterminate'
                disableShrink
                sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#fff' : '#fff'),
                    animationDuration: '550ms',
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round'
                    }
                }}
                size={19}
                thickness={5}
            />
        </div>
    )

}