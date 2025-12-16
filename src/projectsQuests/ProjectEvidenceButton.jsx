import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import YouTubeIcon from '@mui/icons-material/YouTube'
import DiscordIcon from '../resources/DiscordIcon.jsx'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import SubjectIcon from '@mui/icons-material/Subject'
import Tooltip from '@mui/material/Tooltip'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import isValidUrl from '../util/isValidUrl'

export default function ProjectEvidenceButton({evidenceUrl, handleChange = ()=>{}, owner=false}) {


    const handleClick = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        const newWindow = window.open(evidenceUrl, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [evidenceUrl])

    let icon = <SubjectIcon style={{width: 20, height: 20}}/>

    if (evidenceUrl.match(/(https|http):\/\/.*(youtu.be|youtube.com)/)) {
        icon = <YouTubeIcon style={{width: 20, height: 20}}/>
    } else if (evidenceUrl.match(/(https|http):\/\/.*discord.com/)) {
        icon = <DiscordIcon style={{width: 20, height: 20}}/>
    } else if (evidenceUrl.match(/(https|http):\/\/.*imgur.com/)) {
        icon = <PhotoCameraIcon style={{width: 20, height: 20}}/>
    }

    return (
        <React.Fragment>
            {isValidUrl(evidenceUrl) &&
                <Tooltip title='View Documentation' arrow disableFocusListener>
                    <IconButton style={{width: 40, height: 40}} onClick={handleClick}>
                        {icon}
                    </IconButton>
                </Tooltip>
            }
            {(!!evidenceUrl && !isValidUrl(evidenceUrl)) &&
                <Tooltip title='Documentation link is not valid' arrow disableFocusListener>
                    <IconButton style={{width: 40, height: 40}} onClick={handleChange}>
                        <ErrorOutlineIcon style={{width: 22, height: 22, color:'#c07b32'}}/>
                    </IconButton>
                </Tooltip>
            }
            {!evidenceUrl &&
                <Tooltip title='Documentation link is missing' arrow disableFocusListener>
                    <IconButton style={{width: 40, height: 40}} onClick={handleChange}>
                        <ErrorOutlineIcon style={{width: 22, height: 22, color:'#e55940'}}/>
                    </IconButton>
                </Tooltip>
            }
        </React.Fragment>
    )
}


