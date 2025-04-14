import React, {useCallback, useContext, useState} from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Tooltip from '@mui/material/Tooltip'
import postVoteUpdate from './postVoteUpdate'
import LoadingDisplayWhite from '../misc/LoadingDisplayWhite.jsx'
import {enqueueSnackbar} from 'notistack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import SelectBox from '../formUtils/SelectBox.jsx'
import {uniqueBelts} from '../data/belts'
import DataContext from '../context/DataContext.jsx'

export default function AddVote({user, entry}) {
    const [isUpdating, setIsUpdating] = useState(false)
    const [upvote, setUpvote] = useState(false)
    const [form, setForm] = useState({})
    const [updated, setUpdated] = useState(false)
    const {profile} = useContext(DataContext)
    const {requestedBy = []} = entry

    const isOwner = requestedBy.find(req => (req.userId === user.uid && req.owner)) || false
    const hasVoted = requestedBy.find(req => req.userId === user.uid) || false

    const voteCount = requestedBy.length > 1 ? requestedBy.length : ''
    const voteCountBorder = requestedBy.length > 1 ? '2px solid #444' : ''
    const iconColor = isOwner ?'#999' : '#fff'
    const voteCountIcon = hasVoted
        ? <AddCircleIcon fontSize='small' style={{color:iconColor}}/>
        : <AddCircleOutlineIcon fontSize='small'/>

    const tooltipText = isOwner
        ? 'You requested this lock'
        : hasVoted
            ? 'Click to remove your vote'
            : 'Add Your Vote'
    const cursor = isOwner || isUpdating ? 'default' : 'pointer'

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
        setUpdated((form.discordUsername && form.discordUsername.length > 0) || (form.redditUsername && form.redditUsername.length > 0))
    }, [form])

    const handleEditClose = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        setForm({})
        setUpdated(false)
        setUpvote(false)
    }, [])

    const handleVote = useCallback(async () => {
        if (isUpdating) return
        if (isOwner) {
            enqueueSnackbar('You requested this lock', {variant: 'info', autoHideDuration: 1000})
            return
        }
        setIsUpdating(true)
        const newVote = {...form, entryId: entry.id, owner: false, userId: user.uid, displayName: profile.displayName}
        try {
            await postVoteUpdate({newVote, user})
        } catch (error) {
            console.error('Error updating vote:', error)
        } finally {
            setIsUpdating(false)
            setForm({})
            setUpdated(false)
            setUpvote(false)
        }
    }, [entry.id, form, isOwner, isUpdating, profile.displayName, user])

    const handleClick = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        if (isUpdating) return
        if (isOwner) {
            enqueueSnackbar('You requested this lock', {variant: 'info', autoHideDuration: 3000})
            return
        }
        if (hasVoted) {
            handleVote().then()
        } else {
            setUpvote(true)
        }
    }, [handleVote, hasVoted, isOwner, isUpdating])

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

            <Dialog open={upvote} onClose={handleEditClose} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.7}},
            }}>
                <div
                    style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto',
                        maxWidth: 340, padding: 20}} onClick={(e) => e.stopPropagation()}>
                    <div style={{fontSize: '1.3rem', fontWeight: 500, marginBottom: 10}}>
                        Upvote Request
                    </div>
                    <div style={{marginBottom: 20, fontSize:'0.95rem', lineHeight:'1.3rem'}}>
                        A lot of work goes into ranking locks, and we use these votes to prioritize which locks are considered.
                        Please only vote for locks you are specifically interested in.
                    </div>

                    <div style={{flexGrow: 1}}>
                        <div style={{fontSize: '1.1rem'}}>
                            Notes <span style={{color: '#aaa'}}>(optional)</span>
                        </div>
                        <TextField type='text' name='notes' multiline fullWidth rows={3}
                                   color='info'
                                   style={{}} value={form.notes || ''}
                                   maxLength={1200} id='notes' onChange={handleFormChange}/>
                    </div>

                    <div style={{marginTop: 20}}>
                            <div style={{fontSize: '1.1rem', fontWeight: 500}}>
                                Contact Info
                            </div>

                        <div style={{}}>
                            <div style={{fontSize: '1rem'}}>Discord Username</div>
                            <TextField type='text' name='discordUsername' style={{width: 200}}
                                       onChange={handleFormChange} value={form.discordUsername || ''}
                                       color='info' size='small'/>
                        </div>

                        <div style={{marginTop: 5}}>
                            <div style={{fontSize: '1rem'}}>AND/OR Reddit Username</div>
                            <TextField type='text' name='redditUsername' style={{width: 200}}
                                       onChange={handleFormChange} value={form.redditUsername || ''}
                                       color='info' size='small'/>
                        </div>

                    </div>

                    <div style={{marginTop: 15}}>
                        <div style={{fontSize: '1rem'}}>
                            Your current belt <span style={{color: '#aaa'}}>(optional)</span>
                        </div>
                        <SelectBox changeHandler={handleFormChange}
                                   name='userBelt' form={form}
                                   optionsList={['Unranked', ...uniqueBelts]}
                                   multiple={false} defaultValue={''}
                                   size={'small'} width={200}/>
                    </div>

                    <div style={{width: '100%', textAlign: 'center', marginTop: 25}}>
                        <Button onClick={handleEditClose} variant='contained' color='success'
                                style={{marginRight: 20, backgroundColor: '#999'}}>
                            CANCEL
                        </Button>
                        <Button onClick={handleVote} variant='contained' color='success'
                                disabled={!updated}>
                            SAVE
                        </Button>
                    </div>
                </div>
            </Dialog>

        </React.Fragment>
    )
}