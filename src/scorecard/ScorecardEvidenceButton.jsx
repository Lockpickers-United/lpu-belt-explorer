import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import YouTubeIcon from '@mui/icons-material/YouTube'
import DiscordIcon from '../resources/DiscordIcon.jsx'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import SubjectIcon from '@mui/icons-material/Subject'
import Tooltip from '@mui/material/Tooltip'
import isValidUrl from '../util/isValidUrl'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export default function ScorecardEvidenceButton({url, exceptionType, handleChange, owner}) {

    const handleClick = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [url])

    const notValidUrl = !isValidUrl(url)

    let icon = <SubjectIcon style={{width: 20, height: 20}}/>

    if (url.match(/(https|http):\/\/.*(youtu.be|youtube.com)/)) {
        icon = <YouTubeIcon style={{width: 20, height: 20}}/>
    } else if (url.match(/(https|http):\/\/.*discord.com/)) {
        icon = <DiscordIcon style={{width: 20, height: 20}}/>
    } else if (url.match(/(https|http):\/\/.*imgur.com/)) {
        icon = <PhotoCameraIcon style={{width: 20, height: 20}}/>
    }

    return (
        <React.Fragment>
            {exceptionType !== 'badlink' &&
                <Tooltip title='View Documentation' arrow disableFocusListener>
                    <IconButton style={{width: 40, height: 40}} onClick={handleClick} disabled={notValidUrl}>
                        {icon}
                    </IconButton>
                </Tooltip>
            }
            {(exceptionType === 'badlink' && !!url && owner) &&
                <Tooltip title='Documentation link is not valid' arrow disableFocusListener>
                    <IconButton style={{width: 40, height: 40}} onClick={handleChange}>
                        <ErrorOutlineIcon style={{width: 22, height: 22, color:'#c07b32'}}/>
                    </IconButton>
                </Tooltip>
            }
            {(exceptionType === 'badlink' && !url && owner) &&
                <Tooltip title='Documentation link is missing' arrow disableFocusListener>
                    <IconButton style={{width: 40, height: 40}} onClick={handleChange}>
                        <ErrorOutlineIcon style={{width: 22, height: 22, color:'#e55940'}}/>
                    </IconButton>
                </Tooltip>
            }
        </React.Fragment>
    )
}


