import React, {useCallback, useState} from 'react'
import Button from '@mui/material/Button'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import DisplayDialog from '../../misc/DisplayDialog.jsx'
import TextField from '@mui/material/TextField'
import useWindowSize from '../../util/useWindowSize.jsx'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'

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
    const [includeRequirements, setIncludeRequirements] = useState(false)

    const handleClose = useCallback(() => {
        setAnchorEl(null)
        setReplyText(action === 'approve' ? getDefaultMessage(entry.belt) : '')
    }, [action, entry.belt])

    const handleChange = useCallback((event) => {
        setReplyText(event.target.value)
    }, [])

    const handleSubmit = useCallback((event) => {
        handleClose()
        let fullReply = replyText.replace(/:\w*belt:/i, (match) => {
            return beltEmoji[match]
        })
        if (includeRequirements && !entry.belt.includes('Dan')) {
            const reqLink = `https://lpubelts.com/#/locks?tab=${entry.belt.replace(' Belt', '')}&id=beltreqs`
            fullReply = `${replyText}\n\nCheck out the ${entry.belt} requirements here: ${reqLink}`
            handleReply && handleReply(action, fullReply, event)
        } else {
            handleReply && handleReply(action, fullReply, event)
        }
    }, [action, entry.belt, handleClose, handleReply, includeRequirements, replyText])

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
                        <div style={{padding: '24px 16px 24px'}}>
                            <div style={{fontSize: '1.2rem', fontWeight: 600, marginBottom: 4}}>
                                {action === 'deny' ? 'Deny' : 'Approve'} Belt Request
                            </div>
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
                            {action === 'deny' && !entry.belt.includes('Dan') &&
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={includeRequirements}
                                                onClick={() => setIncludeRequirements(prev => !prev)}
                                                color='info'
                                            />
                                        }
                                        label='Include requirements link with reply.'/>
                                </FormGroup>
                            }
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <Button onClick={handleClose} variant='contained' size='small'
                                    style={{marginBottom: 32, marginRight: 16, backgroundColor: '#999', color: '#222'}}>
                                Cancel
                            </Button>
                            <Button style={{marginBottom: 32, color: '#222'}}
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

const beltEmoji = {
    ':whitebelt:': '<:whitebelt:336531963634515972>',
    ':yellowbelt:': '<:yellowbelt:336531963764539393>',
    ':orangebelt:': '<:orangebelt:336531963877785601>',
    ':greenbelt:': '<:greenbelt:336531963844362242>',
    ':bluebelt:': '<:bluebelt:336531963835973632>',
    ':purplebelt:': '<:purplebelt:336531963521531913>',
    ':brownbelt:': '<:brownbelt:336531963525464065>',
    ':redbelt:': '<:redbelt:336531963869528067>',
    ':blackbelt:': '<:blackbelt:336531963546566659>',
    ':luo:': '<:lpu:585997905773461514>',
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
