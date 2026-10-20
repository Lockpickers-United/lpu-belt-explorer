import Button from '@mui/material/Button'
import React, {useCallback, useState} from 'react'
import OpenWithIcon from '@mui/icons-material/OpenWith'
import IconButton from '@mui/material/IconButton'
import DisplayDialog from '../misc/DisplayDialog.jsx'
import TextField from '@mui/material/TextField'
import {useAccess} from '../app/AccessContext.jsx'

export default function ReassignVoteButton({
                                               handleMoveVote,
                                               currentEntryId,
                                               pending = false,
                                               disabled = false,
                                               hasUnsavedEdits = false,
                                               style={},
                                               size = 'small'
                                           }) {
    const {accessInfo} = useAccess()

    const [inputValue, setInputValue] = useState('')
    const [moveError, setMoveError] = useState(null)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback(() => {
        setInputValue('')
        setMoveError(null)
        setAnchorEl(null)
    }, [])
    const handleChange = useCallback((event) => {
        setInputValue(event.target.value)
        setMoveError(null)
    }, [])

    const handleSave = useCallback(async () => {
        try {
            await handleMoveVote(inputValue.trim().toLowerCase())
            handleClose()
        } catch (error) {
            setMoveError(error.message)
        }
    }, [inputValue, handleMoveVote, handleClose])

    if (!accessInfo?.roles?.classificationAdmin && !accessInfo?.roles?.admin) return null

    const moveDisabled = disabled
        || pending
        || hasUnsavedEdits
        || !/^[0-9a-fA-F]{8}$/.test(inputValue.trim())
        || inputValue.trim().toLowerCase() === currentEntryId

    const optionalHeaderStyle = {fontSize: '1.0rem', fontWeight: 400, marginBottom: 5, paddingLeft: 2, color: '#fff'}

    const dialogContent = (
        <div style={{}}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                maxWidth: 550,
                padding: 24,
                marginTop: 10,
                justifyContent: 'center'
            }}>
                <div style={{...optionalHeaderStyle, flexGrow: 1, fontWeight: 700}}>
                    Move vote to different lock
                </div>
                <TextField type='text' name='entryId'
                           value={inputValue}
                           onChange={handleChange}
                           id='newId'
                           color='info'
                           size='small'
                           style={{}}
                           placeholder='Target lock ID'
                           variant='outlined'
                           autoFocus
                           error={Boolean(moveError)}
                           helperText={moveError}
                           slotProps={{
                               htmlInput: {maxLength: 8, style: {fontSize: '0.9rem', textAlign: 'center'}}
                           }}
                />
                {hasUnsavedEdits && <div role='status' style={{marginTop: 8, fontSize: '0.9rem'}}>
                    Save or cancel your edits before moving.
                </div>}
                <div style={{flexGrow: 1, textAlign: 'right', marginTop: 16}}>
                    <Button variant='text' size='small' onClick={handleClose} disabled={pending}
                            style={{marginRight: 8}}>Cancel</Button>
                    <Button variant='text' size='small' onClick={handleSave} color='success' disabled={moveDisabled}>
                        {pending ? 'Moving…' : 'Move Vote'}
                    </Button>
                </div>
            </div>
        </div>
    )
    return (
        <div>
            <IconButton
                onClick={handleOpen}
                style={{color: '#e16936', ...style}}
                size={size}
                disabled={disabled || pending}
                aria-label='Move vote to another lock'
            >
                <OpenWithIcon fontSize='small'/>
            </IconButton>
            <DisplayDialog dialogContent={dialogContent} open={open} handleClose={handleClose}
                           width={300}/>
        </div>
    )
}
