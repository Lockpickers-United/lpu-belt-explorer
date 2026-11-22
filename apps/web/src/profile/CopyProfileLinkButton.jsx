import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useContext} from 'react'
import {useParams, useSearchParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext'

function CopyProfileLinkButton({page, safeName, mostPopular}) {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const [searchParams, _setSearchParams] = useSearchParams()
    searchParams.set('name', safeName)
    const searchParamsString = searchParams.toString().length
        ? `?${searchParams.toString()}`
        : ''
    const hostname = `${window.location.protocol}//${window.location.host}`
    const handleClick = useCallback(async () => {
        const link = page === 'collection'
            ? `${hostname}/#/profile/${userId || user?.uid}${searchParamsString}`
            : !mostPopular
                ? `${hostname}/#/profile/${userId || user?.uid}/${page}${searchParamsString}`
                : `${hostname}/#/profile/${userId || user?.uid}/scorecard/popular${searchParamsString}`
        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Profile link copied to clipboard.')
    }, [page, hostname, userId, user?.uid, mostPopular, searchParamsString])

    if (!user) return null
    return (
        <Tooltip title='Copy Profile Link' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyProfileLinkButton
