import React from 'react'
import IconButton from '@mui/material/IconButton'
import YouTubeIcon from '@mui/icons-material/YouTube'
import DiscordIcon from '../resources/DiscordIcon.jsx'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import SubjectIcon from '@mui/icons-material/Subject'

export default function ScorecardEvidenceButton({url}) {

    let icon = <SubjectIcon style={{width: 20, height: 20}}/>
    if (url.match(/(https|http):\/\/.*(youtu.be|youtube.com)/)) {
        icon = <YouTubeIcon style={{width: 20, height: 20}}/>
    } else if (url.match(/(https|http):\/\/.*discord.com/)) {
        icon = <DiscordIcon style={{width: 20, height: 20}}/>
    } else if (url.match(/(https|http):\/\/.*imgur.com/)) {
        icon = <PhotoCameraIcon style={{width: 20, height: 20}}/>
    }

    return (
        <IconButton style={{width:40, height:40}}>
            <a href={url} target='_blank' rel='noreferrer' style={{color:'#ddd'}}>{icon}</a>
        </IconButton>
    )
}


