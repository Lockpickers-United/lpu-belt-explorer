import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import GitHubIcon from '@mui/icons-material/GitHub'
import IconButton from '@mui/material/IconButton'

function GithubButton({url}) {
    return (
        <Tooltip title='View on GitHub' arrow disableFocusListener>
            <IconButton href={url} target='_blank' rel="noopener noreferrer nofollow">
                <GitHubIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default GithubButton
