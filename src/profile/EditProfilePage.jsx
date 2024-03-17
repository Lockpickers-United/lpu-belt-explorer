import Stack from '@mui/material/Stack'
import React, {useCallback, useContext, useState} from 'react'
import {enqueueSnackbar} from 'notistack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'

function EditProfilePage() {
    const {lockCollection, updateProfileVisibility, clearProfile} = useContext(DBContext)
    const [displayName, setDisplayName] = useState(lockCollection.displayName || '')
    const [visibility] = useState(true)
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
            await updateProfileVisibility(visibility, displayName)
            enqueueSnackbar('Updated profile.')
            // TODO: new display name doesn't show up on view profile until refresh
            navigate(`/profile/${user.uid}`)
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile.')
        }
    }, [updateProfileVisibility, visibility, displayName, navigate, user.uid])

    const handleClearProfile = useCallback(async () => {
        try {
            await clearProfile()
            setDisplayName('')
            enqueueSnackbar('Display Name cleared.')
            // TODO: cleared display name doesn't show up on view profile until refresh
            //navigate(`/profile/${user.uid}`)
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile.')
        }
    }, [clearProfile])

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
        ? 'Save As Public'
        : 'Save'

    return (
        <Card style={{
            maxWidth: 380,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 16,
            marginBottom: 46
        }}>
            <CardHeader title={cardTitleText} action={null}/>
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
                <Stack direction='row'>
                    <TextField
                        error={error}
                        fullWidth
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
                    />
                </Stack>
            </CardContent>
            <CardActions>
                <div style={{width: '100%', textAlign: 'right', margin: '0px 10px 10px 0px'}}>
                    {lockCollection?.displayName &&
                        <Tooltip title='Clear Profile' arrow disableFocusListener>
                            <Button variant='outlined'
                                    color='info'
                                    onClick={handleClearProfile}
                                    disabled={error}
                                    style={{marginBottom: 10, color: '#4972ab'}}
                            >
                                Clear Display Name
                            </Button>
                        </Tooltip>
                    }
                    <Tooltip title='Save' arrow disableFocusListener>
                        <Button variant='outlined'
                                color={error ? undefined : 'success'}
                                onClick={handleSave}
                                disabled={error || noSave}
                                style={{marginLeft: 15, marginBottom: 10}}
                        >
                            {saveButtonText}
                        </Button>
                    </Tooltip>
                </div>
            </CardActions>
        </Card>
    )
}

const pattern = /^[\sa-zA-Z0-9_-]{1,32}$/

export default EditProfilePage
