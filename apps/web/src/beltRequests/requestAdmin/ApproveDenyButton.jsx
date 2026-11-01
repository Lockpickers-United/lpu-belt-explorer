import React, {useCallback, useState} from 'react'
import Button from '@mui/material/Button'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import DisplayDialog from '../../misc/DisplayDialog.jsx'
import TextField from '@mui/material/TextField'
import useWindowSize from '../../util/useWindowSize.jsx'

export default function ApproveDenyButton({entry, action, handleReply, processing}) {
    const {isMobile} = useWindowSize()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])

    const [replyText, setReplyText] = useState(action === 'approve' ? getDefaultMessage(entry.belt) : '')

    const handleClose = useCallback(() => {
        setAnchorEl(null)
        setReplyText(action === 'approve' ? getDefaultMessage(entry.belt) : '')
    }, [action, entry.belt])

    const handleChange = useCallback((event) => {
        setReplyText(event.target.value)
    }, [])

    const handleSubmit = useCallback((event) => {
        handleClose()
        handleReply && handleReply(action, replyText, event)
    }, [action, handleClose, handleReply, replyText])

    return (
        <>
            {action === 'approve' &&
                <Button onClick={handleOpen}
                        style={{color: '#20b924', flexGrow: 0, marginRight: 8}} variant='text'>
                    {processing !== 'approve' ? 'Approve' : <LoadingDisplay size={20} white={true}/>}
                </Button>
            }
            {action === 'deny' &&
                <Button onClick={handleOpen}
                        style={{color: '#e16936', flexGrow: 0}} variant='text'>
                    {processing !== 'deny' ? 'Deny' : <LoadingDisplay size={20} white={true}/>}
                </Button>
            }
            <DisplayDialog
                dialogContent={
                    <>
                        <div style={{padding: '32px 16px', textAlign: 'center'}}>
                            <TextField type='text' name='reply' multiline fullWidth
                                       rows={isMobile ? 15 : 10}
                                       value={replyText} onChange={handleChange}
                                       id='reply'
                                       color='info' style={{}}
                                       placeholder='Reply message.'
                                       variant='outlined'
                                       autoFocus
                                       slotProps={{
                                           htmlInput: {maxLength: 1200, style: {fontSize: '1.0rem'}}
                                       }}
                            />
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <Button onClick={handleClose} variant='contained' size='small'
                                style={{marginBottom: 24, marginRight: 16, backgroundColor:'#999', color: '#222'}}>
                                Cancel
                            </Button>
                            <Button style={{marginBottom: 24, color: '#222'}}
                                    variant='contained'
                                    disabled={action === 'deny' && replyText.length === 0}
                                    onClick={(e => handleSubmit(e))}
                                    size='small'
                                    color={action === 'approve' ? 'success' : 'warning'}
                            >{action === 'approve' ? 'Approve' : 'Deny'}</Button>
                        </div>
                    </>
                } open={open} handleClose={handleClose} width={350}/>
        </>
    )
}

function getDefaultMessage(belt) {
    const defaultMessages = {
        'White Belt': ' Welcome to LPU! :whitebelt:',
        'Yellow Belt': ' Nice work! :yellowbelt:',
        'Orange Belt': ' Way to go! :orangebelt:',
        'Green Belt': ' Movin\' on up! :greenbelt:',
        'Blue Belt': ' Awesome! :bluebelt:',
        'Purple Belt': ' Big milestone! :purplebelt:',
        'Brown Belt': ' Great work! :brownbelt:',
        'Red Belt': ' When Black? :redbelt:',
        'Black Belt': ' What a tremendous accomlishment. :lpu:'
    }
    return defaultMessages[belt] || 'Nice work!'
}