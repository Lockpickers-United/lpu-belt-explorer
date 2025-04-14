import React, {useCallback, useContext} from 'react'
import {enqueueSnackbar} from 'notistack'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import DBContext from '../app/DBContext.jsx'
import dayjs from 'dayjs'

function AcceptRequestButton({entry, requestMod}) {

    if (entry.status !== 'Requested' || !requestMod) return null

    const {acceptRankingRequest} = useContext(DBContext)
    const handleClick = useCallback(async () => {
        const acceptedEntry = {
            ...entry,
            status: 'Accepted',
            lastUpdated: dayjs().toISOString()
        }
        await acceptRankingRequest(acceptedEntry)
        enqueueSnackbar('Request accepted.')
    }, [acceptRankingRequest, entry])

    return (
        <Tooltip title='Accept Request for Consideration' arrow disableFocusListener>
            <Button onClick={handleClick} variant='contained' color='info' size='small'>
                Accept Request
            </Button>
        </Tooltip>
    )
}

export default AcceptRequestButton
