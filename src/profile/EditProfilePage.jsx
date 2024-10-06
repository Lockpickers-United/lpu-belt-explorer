import React, {useCallback, useContext, useState} from 'react'
import {enqueueSnackbar} from 'notistack'
import TextField from '@mui/material/TextField'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import LoadingDisplay from '../misc/LoadingDisplay'
import useWindowSize from '../util/useWindowSize.jsx'

function EditProfilePage() {
    const {
        lockCollection,
        updateProfileDisplayName,
        deleteAllUserData,
        oauthState,
        removeServiceAuth
    } = useContext(DBContext)
    const [displayName, setDisplayName] = useState(lockCollection.displayName || '')
    const [anchorEl, setAnchorEl] = useState(null)
    const [deletingData, setDeletingData] = useState(false)
    const navigate = useNavigate()
    const {user} = useContext(AuthContext)
    const {isMobile} = useWindowSize()

    const handleChange = useCallback(event => {
        const {value} = event.target
        setDisplayName(value)
    }, [])

    const handleFocus = useCallback(event => event.target.select(), [])

    const handleSave = useCallback(async () => {
        try {
            await updateProfileDisplayName(displayName)
            enqueueSnackbar('Profile updated')
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile')
        }
    }, [updateProfileDisplayName, displayName])

    const handleClear = useCallback(async () => {
        try {
            await updateProfileDisplayName(null)
            setDisplayName('')
            enqueueSnackbar('Display Name cleared')
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile')
        }
    }, [updateProfileDisplayName])

    const handleViewProfile = useCallback(() => {
        navigate(`/profile/${user.uid}`)
    }, [navigate, user.uid])

    const handleDeleteConfirm = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }, [])


    const removeService = useCallback(async (service) => {
        await removeServiceAuth(service)
        enqueueSnackbar(`${service} account removed.`)
    }, [removeServiceAuth])

    const handleDiscordAuth = useCallback(() => {
        const {VITE_DISCORD_CLIENT_ID: clientId} = import.meta.env
        const scope = encodeURIComponent('identify')
        const redirectUri = encodeURIComponent(`${location.origin}/#/auth/discord`)

        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`
        window.location.assign(url)
    }, [])

    const handleRedditAuth = useCallback(async () => {
        const {VITE_REDDIT_CLIENT_ID: clientId} = import.meta.env
        const newState = await oauthState()
        const scope = encodeURIComponent('identity flair privatemessages')
        const redirectUri = encodeURIComponent(`${location.origin}/#/auth/reddit`)

        const url = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${newState}&redirect_uri=${redirectUri}&duration=temporary&scope=${scope}`
        window.location.assign(url)
    }, [oauthState])

    const handleDeleteAllData = useCallback(async () => {
        setDeletingData(true)
        await deleteAllUserData(user.uid)
        setAnchorEl(null)
        setDeletingData(false)
        enqueueSnackbar('All data has been deleted')
    }, [deleteAllUserData, user])

    const error = displayName.length > 0 && !pattern.test(displayName.toString())
    const noSave = displayName.length === 0 || displayName === lockCollection?.displayName
    const helperText = error
        ? 'Display name must only include A-Z, 0-9, _ and -.'
        : ''

    const introNameText = displayName.length > 0
        ? ` (${displayName}) `
        : ''

    const flexStyle = !isMobile ? 'flex' : 'block'

    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            {deletingData ?
                <LoadingDisplay/>
                :
                <React.Fragment>
                    <div style={{display: flexStyle, padding: 16}}>
                        {lockCollection?.displayName ?
                            <div style={{marginBottom: 10, marginRight: 20, maxWidth: 325}}>
                                <span style={{fontSize: '1.2rem', fontWeight: 500}}>Display Name<br/></span>
                                Your display name {introNameText} shows up on the leaderboard and
                                your profile can be shared with others.
                                <br/><br/>
                                Your Google login information will never be displayed to other users.
                            </div>
                            :
                            <div style={{marginBottom: 10, marginRight: 20, maxWidth: 325}}>
                                <span style={{fontSize: '1.2rem', fontWeight: 500}}>Display Name<br/></span>
                                Your display name will show up on the leaderboard and
                                your profile can be shared with others.
                                <br/><br/>
                                Your Google login information will never be displayed to other users.
                            </div>
                        }

                        <div style={{width: '100%', marginTop: 40}}>
                            <TextField
                                error={error}
                                variant='outlined'
                                color='secondary'
                                label='Display Name'
                                helperText={helperText}
                                value={displayName || ''}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                inputProps={{
                                    maxLength: 32
                                }}
                                size='small'
                                style={{width: 220}}

                            />
                            <Button variant='outlined'
                                    color={error ? undefined : 'success'}
                                    onClick={handleSave}
                                    disabled={error || noSave}
                                    style={{marginLeft: 16, marginRight: 0, marginBottom: 10, height: 40}}
                            >
                                Save
                            </Button>

                            <div style={{width: '100%', textAlign: 'left', margin: '10px 0px 28px 0px'}}>
                                {lockCollection?.displayName &&
                                    <Button variant='outlined'
                                            color='info'
                                            onClick={handleClear}
                                            disabled={error}
                                            style={{marginBottom: 10, color: '#4972ab', padding: '5px 10px'}}
                                    >
                                        Clear Display Name
                                    </Button>
                                }
                                <Button variant='outlined'
                                        color='info'
                                        onClick={handleViewProfile}
                                        style={{
                                            marginLeft: 15,
                                            marginBottom: 10,
                                            padding: '5px 10px'
                                        }}
                                >
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div style={{display: flexStyle, padding: 16}}>

                        <div style={{marginBottom: 10, marginRight: 20, maxWidth: 325}}>
                            <span style={{fontSize: '1.2rem', fontWeight: 500}}>Linked Accounts<br/></span>
                            Linked accounts are used to import your approved Belt and Dan Rankings.
                            Rankings from Discord will update automatically as long as your account is linked.
                            You will need to re-authorize with Reddit to update new approved belts.
                        </div>

                        <div style={{width: '100%', marginTop: 40}}>
                            {!lockCollection?.discordUsername ?
                                <Button variant='outlined'
                                        color='warning'
                                        style={{
                                            marginBottom: 16,
                                            height: 40
                                        }}
                                        onClick={handleDiscordAuth}
                                >LINK DISCORD ACCOUNT</Button>
                                : <div style={{width: '100%', marginBottom:10}}>
                                    <TextField
                                        variant='outlined'
                                        label='Discord Username'
                                        value={lockCollection?.discordUsername || ''}
                                        inputProps={{
                                            maxLength: 32,
                                            readOnly: true
                                        }}
                                        size='small'
                                        style={{width: 200}}
                                        color='warning'
                                    />
                                    <Button variant='outlined'
                                            color='warning'
                                            onClick={() => removeService('Discord')}
                                            disabled={!lockCollection?.discordUsername}
                                            style={{
                                                marginLeft: 16,
                                                marginRight: 0,
                                                marginBottom: 10,
                                                height: 40
                                            }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            }

                            {!lockCollection?.redditUsername ?
                                <Button variant='outlined'
                                        color='warning'
                                        style={{
                                            marginBottom: 16,
                                            height: 40
                                        }}
                                        onClick={handleRedditAuth}
                                >LINK REDDIT ACCOUNT</Button>
                                : <div style={{width: '100%', padding: '8px 0px'}}>
                                    <TextField
                                        variant='outlined'
                                        label='Reddit Username'
                                        value={lockCollection?.redditUsername || ''}
                                        inputProps={{
                                            maxLength: 32,
                                            readOnly: true
                                        }}
                                        size='small'
                                        style={{width: 200}}
                                        color='warning'
                                        readOnly
                                    />
                                    <Button variant='outlined'
                                            color='warning'
                                            onClick={() => removeService('Reddit')}
                                            disabled={!lockCollection?.redditUsername}
                                            style={{
                                                marginLeft: 16,
                                                marginRight: 0,
                                                marginBottom: 10,
                                                height: 40
                                            }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>

                    <div style={{width: '100%', textAlign: 'center', margin: '10px 0px 10px 0px'}}>
                        <Button variant='outlined'
                                color='error'
                                onClick={handleDeleteConfirm}
                                style={{marginBottom: 10, color: '#d31f1f', padding: '5px 110px'}}
                        >
                            Delete All Data
                        </Button>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <div style={{padding: 20, textAlign: 'center'}}>
                                This will permanently delete all of your data.<br/>
                                Are you sure?
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <Button style={{marginBottom: 10, color: '#000'}}
                                        variant='contained'
                                        onClick={handleDeleteAllData}
                                        edge='start'
                                        color='error'
                                >
                                    Delete
                                </Button>
                            </div>
                        </Menu>
                    </div>
                    <div style={{height: 20}}/>
                </React.Fragment>
            }
        </div>
    )
}

const pattern = /^[\sa-zA-Z0-9_-]{1,32}$/

export default EditProfilePage
