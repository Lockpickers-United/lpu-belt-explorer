import React from 'react'
import Typography from '@mui/material/Typography'
import ToggleBetaButton from './ToggleBetaButton'

function Footer({extras, before}) {
    return (

        <Typography align='center' component='div' style={{marginTop: 16, marginBottom: 80}}>

            {before}

            <a href='https://discord.gg/lockpicking' target='_blank' rel='noopener noreferrer'>
                Discord
            </a>
            &nbsp;•&nbsp;
            <a href='https://www.reddit.com/r/lockpicking/' target='_blank' rel='noopener noreferrer'>
                Reddit
            </a>
            &nbsp;•&nbsp;
            <a href='https://www.youtube.com/@LockPickersUnited' target='_blank' rel='noopener noreferrer'>
                YouTube
            </a>
            &nbsp;•&nbsp;
            <a href='/#/usage'>
                Usage
            </a>
            &nbsp;•&nbsp;
            <a href='/#/privacy'>
                Privacy
            </a>

            {extras}

            <div>
                <ToggleBetaButton/>
            </div>
        </Typography>
    )
}

export default Footer
