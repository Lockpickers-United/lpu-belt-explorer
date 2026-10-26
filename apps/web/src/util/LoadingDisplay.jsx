import LinearProgress from '@mui/material/LinearProgress'
import React from 'react'
import lpuLogoPath from '../resources/LPU.png'

function LoadingDisplay() {
    return (
        <React.Fragment>
            <LinearProgress variant='indeterminate' color='secondary'/>
            <img alt='Loading' src={lpuLogoPath} style={{
                marginLeft: 'auto', marginRight: 'auto', display: 'block'
            }}/>
        </React.Fragment>
    )
}

export default LoadingDisplay
