import React from 'react'
import Typography from '@mui/material/Typography'

function Footer() {
    return (
        <div style={{width: '100%'}}>
            <Typography align='center' variant='caption' component='span' sx={{display: 'block', width: '100%'}}>
                Content is available under&nbsp;
                <a href='https://creativecommons.org/licenses/by-sa/3.0'>
                    Creative Commons Attribution/ShareAlike 3.0
                </a>
            </Typography>
        </div>
    )
}

export default Footer
