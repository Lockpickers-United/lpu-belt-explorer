import React, {useCallback, useState} from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Tooltip from '@mui/material/Tooltip'
import postVoteUpdate from './postVoteUpdate.jsx'
import LoadingDisplayWhite from '../misc/LoadingDisplayWhite.jsx'
import {enqueueSnackbar} from 'notistack'

export default function AddVote({user, entry}) {
    const [isUpdating, setIsUpdating] = useState(false)

    const requestedBy = entry.requestedBy || []
    const voteCount = requestedBy.length > 1 ? requestedBy.length : ''
    const voteCountBorder = requestedBy.length > 1 ? '2px solid #444' : ''
    const isOwner = requestedBy[0] === user.uid
    const hasVoted = requestedBy.includes(user.uid)
    const voteCountIcon = hasVoted
        ? <AddCircleIcon fontSize='small'/>
        : <AddCircleOutlineIcon fontSize='small'/>

    const tooltipText = isOwner
        ? 'You requested this lock'
        : hasVoted
            ? 'Click to remove your vote'
            : 'Add Your Vote'

    const cursor = isOwner || isUpdating ? 'default' : 'pointer'

    const handleClick = useCallback(async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (isUpdating) return
        if (isOwner) {
            enqueueSnackbar('You requested this lock', { variant: 'info', autoHideDuration: 3000})
            return
        }
        setIsUpdating(true)

        const entryId = entry.id
        try {
            await postVoteUpdate({entryId, user})
        } catch (error) {
            console.error('Error updating vote:', error)
        } finally {
            setIsUpdating(false)
        }
    }, [entry, isOwner, isUpdating, user])


    return (
        <React.Fragment>
            <Tooltip title={tooltipText} arrow disableFocusListener>
                {isUpdating
                    ? <div onClick={handleClick} style={{
                        padding: '4px 0px',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        alignItems: 'center',
                        justifyContent: 'right'
                    }}>
                        <LoadingDisplayWhite/>
                    </div>
                    : <div onClick={handleClick} style={{
                        border: voteCountBorder,
                        borderRadius: 18,
                        padding: '4px 10px',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'right',
                        fontWeight: 600,
                        cursor: cursor
                    }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {voteCount > 1 &&
                                <span style={{marginLeft: 5, marginRight: 7}}>{voteCount}</span>
                            }
                            {voteCountIcon}
                        </div>
                    </div>
                }
            </Tooltip>
        </React.Fragment>
    )
}