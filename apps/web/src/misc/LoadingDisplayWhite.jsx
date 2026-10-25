import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import {circularProgressClasses} from '@mui/material'

export default function LoadingDisplayWhite({diameter = 40}) {

    return (
        <div style={{display: 'flex', placeItems: 'center', width: diameter, height: diameter}}>
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