import React, {useCallback} from 'react'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import {useParams} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'

export default function ScorecardNoTrackButton() {
    const {userId} = useParams()

    const linkText = `https://lpubelts.com/#/profile/${userId}/scorecard/no-tracking`

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    },[])

    return (
        <IconButton onClick={() => openInNewTab(linkText)}>
            <LaunchOutlinedIcon fontSize='small'/>
        </IconButton>

    )

}