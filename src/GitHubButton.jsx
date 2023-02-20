import React from 'react'
import GitHubIcon from '@mui/icons-material/GitHub.js'
import {Tooltip} from '@mui/material'
import IconButton from '@mui/material/IconButton'

function GitHubButton() {
    return (
        <Tooltip title='View Source on GitHub'>
            <IconButton
                color='inherit' target='_blank' rel='noopener noreferrer'
                href='https://github.com/Lockpickers-United/lpu-belt-explorer' edge='end'
            >
                <GitHubIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default GitHubButton
