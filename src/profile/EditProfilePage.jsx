import React, {useCallback, useContext, useState} from 'react'
import {enqueueSnackbar} from 'notistack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import Menu from '@mui/material/Menu'
import LoadingDisplay from '../misc/LoadingDisplay'

function EditProfilePage() {
    const {lockCollection, updateProfileVisibility, deleteAllUserData, clearProfile} = useContext(DBContext)
    const [displayName, setDisplayName] = useState(lockCollection.displayName || '')
    const [anchorEl, setAnchorEl] = useState(null)
    const [deletingData, setDeletingData] = useState(false)
    const navigate = useNavigate()
    const {user} = useContext(AuthContext)

    const profileType = !lockCollection?.displayName
        ? 'none'
        : lockCollection?.public
            ? 'public'
            : 'private'

    const handleChange = useCallback(event => {
        const {value} = event.target
        setDisplayName(value)
    }, [])

    const handleFocus = useCallback(event => event.target.select(), [])

    const handleSave = useCallback(async () => {
        try {
            await updateProfileVisibility(true, displayName)
            enqueueSnackbar('Profile updated')
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile')
        }
    }, [updateProfileVisibility, displayName])

    const handleClearProfile = useCallback(async () => {
        try {
            await clearProfile()
            setDisplayName('')
            enqueueSnackbar('Display Name cleared')
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile')
        }
    }, [clearProfile])

    const handleViewProfile = useCallback(() => {
        navigate(`/profile/${user.uid}`)
    }, [navigate, user.uid])

    const handleDeleteConfirm = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }, [])

    const handleDeleteAllData = useCallback(async () => {
        setDeletingData(true)
        await deleteAllUserData(user.uid)
        setAnchorEl(null)
        setDeletingData(false)
        enqueueSnackbar('All data has been deleted')
    }, [deleteAllUserData, user])

    const error = displayName.length > 0 && !pattern.test(displayName.toString())
    const noSave = displayName.length === 0
        || (displayName === lockCollection?.displayName && profileType !== 'private')
    const helperText = error
        ? 'Display name must only include A-Z, 0-9, _ and -.'
        : ''

    const cardTitleText = displayName.length > 0
        ? 'Edit Profile'
        : 'Create Profile'
    const introNameText = displayName.length > 0
        ? ` (${displayName}) `
        : ''
    const saveButtonText = profileType === 'private'
        ? 'Save Public'
        : 'Save'
    const inputWidth = profileType === 'private'
        ? 200
        : 260

    return (
        <Card style={{
            maxWidth: 380,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 16,
            marginBottom: 46
        }}>
            <CardHeader title={cardTitleText} action={null}/>
            {deletingData ? 
                <LoadingDisplay/>
            : 
                <React.Fragment>
                    <CardContent>
                        {profileType === 'none' &&
                            <div style={{marginBottom: 10}}>
                                Your display name will show up on the leaderboard and
                                your profile can be shared with others.
                                <br/><br/>
                                Your Google login information will never be displayed to other users.
                            </div>
                        }
                        {profileType === 'public' &&
                            <div style={{marginBottom: 10}}>
                                Your display name {introNameText} shows up on the leaderboard and
                                your profile can be shared by clicking the link icon above.
                                <br/><br/>
                                Your Google login information will never be displayed to other users.
                            </div>
                        }
                        {profileType === 'private' &&
                            <div style={{marginBottom: 10}}>
                                Private profiles are going away soon.
                                Click Save to make your profile public or Clear to remove your display name.
                                Public profiles can be shared and will appear on the leaderboard.
                                <br/><br/>
                                No matter what you choose, your Google login information will never be displayed to other users.
                            </div>
                        }
                        <br/>
                        <div style={{width: '100%'}}>
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
                                style={{width:inputWidth}}

                            />
                                <Button variant='outlined'
                                        color={error ? undefined : 'success'}
                                        onClick={handleSave}
                                        disabled={error || noSave}
                                        style={{marginLeft: 16, marginRight:0, marginBottom: 10, height:40}}
                                >
                                    {saveButtonText}
                                </Button>
                        </div>
                    </CardContent>
                    <CardActions>
                        <div style={{width: '100%', textAlign: 'center', margin: '10px 0px 10px 0px'}}>
                            {lockCollection?.displayName &&
                                    <Button variant='outlined'
                                            color='info'
                                            onClick={handleClearProfile}
                                            disabled={error}
                                            style={{marginBottom: 10, color: '#4972ab', padding:'5px 19px'}}
                                    >
                                        Clear Display Name
                                    </Button>
                            }
                                <Button variant='outlined'
                                        color='info'
                                        onClick={handleViewProfile}
                                        style={{marginLeft: 15, marginBottom: 10,  color: '#4972ab', padding:'5px 19px'}}
                                >
                                    View Profile
                                </Button>
                        </div>

                    </CardActions>
                    <div style={{width: '100%', textAlign: 'center', margin: '10px 0px 10px 0px'}}>
                        <Button variant='outlined'
                                color='info'
                                onClick={handleDeleteConfirm}
                                style={{marginBottom: 10,  color: '#4972ab', padding:'5px 110px'}}
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
                </React.Fragment>
            }
        </Card>
    )
}

const pattern = /^[\sa-zA-Z0-9_-]{1,32}$/

export default EditProfilePage
