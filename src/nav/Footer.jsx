import React from 'react'
import Typography from '@mui/material/Typography'
import ExportButton from '../misc/ExportButton'
import RandomEntryButton from '../misc/RandomEntryButton'
import HotkeyInfoButton from '../misc/HotkeyInfoButton'
import SlideshowButton from '../misc/SlideshowButton'

function Footer() {
    return (
        <Typography align='center' style={{marginBottom: 32}}>
            <span>LPU</span>
            &nbsp;•&nbsp;
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
            <a href='https://github.com/Lockpickers-United' target='_blank' rel='noopener noreferrer'>
                GitHub
            </a>

            <br/>
            <HotkeyInfoButton/>
            &nbsp;•&nbsp;
            <RandomEntryButton/>
            &nbsp;•&nbsp;
            <ExportButton/>
            &nbsp;•&nbsp;
            <SlideshowButton/>
        </Typography>
    )
}

export default Footer
