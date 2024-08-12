import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useContext} from 'react'
import {useParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext'

function CopyProfileLinkButton({page}) {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)

    const handleClick = useCallback(async () => {
        const link = page === 'collection' ? 
            `https://lpubelts.com/#/profile/${userId || user.uid}`
        :
            `https://lpubelts.com/#/profile/${userId || user.uid}/${page}`

        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Link copied to clipboard.')
    }, [userId, user, page])

    if (!user) return null
    return (
        <Tooltip title='Copy My Profile Link' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyProfileLinkButton
