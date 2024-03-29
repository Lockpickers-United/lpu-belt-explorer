import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useContext} from 'react'
import {useParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'

function CopyProfileLinkButton() {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const {lockCollection} = useContext(DBContext)

    const handleClick = useCallback(async () => {
        const safeName = lockCollection.displayName.replace(/\s/g, '_')
        const link = `https://lpubelts.com/#/profile/${user.uid}?name=${safeName}`

        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Link to entry copied to clipboard.')
    }, [user?.uid, lockCollection?.displayName])

    if (!user || userId !== user.uid || !lockCollection?.displayName || lockCollection?.public === false) return null
    return (
        <Tooltip title='Copy My Profile Link' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyProfileLinkButton
