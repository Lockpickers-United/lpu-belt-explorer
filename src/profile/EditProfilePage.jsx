import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import React, {useCallback, useContext, useState} from 'react'
import Typography from '@mui/material/Typography'
import {enqueueSnackbar} from 'notistack'
import SaveIcon from '@mui/icons-material/Save'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'

function EditProfilePage() {
    const {lockCollection, updateProfileVisibility} = useContext(DBContext)
    const [displayName, setDisplayName] = useState(lockCollection.displayName || '')
    const [visibility, setVisibility] = useState(!!lockCollection.public)
    const navigate = useNavigate()
    const {user} = useContext(AuthContext)

    const handleChange = useCallback(event => {
        const {value} = event.target
        setDisplayName(value)
    }, [])

    const handleCheckChange = useCallback(event => {
        const {checked} = event.target
        setVisibility(checked)
    }, [])

    const handleFocus = useCallback(event => event.target.select(), [])

    const handleSave = useCallback(() => {
        try {
            updateProfileVisibility(visibility, displayName)
            enqueueSnackbar('Updated profile.')
            navigate(`/profile/${user.uid}`)
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile.')
        }
    }, [navigate, displayName, updateProfileVisibility, user?.uid, visibility])

    const error = visibility && !pattern.test(displayName)

    const helperText = error
        ? displayName.length === 0
            ? 'Public profiles must have a display name.'
            : 'Display name must only include A-Z, 0-9, _ and -.'
        : visibility === true
            ? `Your profile will be public, as ${displayName}.`
            : 'Your profile will be private'

    return (
        <Card style={{
            maxWidth: 350,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 16,
            marginButtom: 16
        }}>
            <CardHeader title='Edit Profile' action={
                <Tooltip title='Save' arrow disableFocusListener>
                    <IconButton onClick={handleSave} disabled={error}>
                        <SaveIcon color={error ? undefined : 'success'}/>
                    </IconButton>
                </Tooltip>
            }/>
            <CardContent>
                <Typography>
                    Set a display name for your profile.
                    Public profiles can be shared and show nicknames on the leaderboard.
                </Typography>
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
                    <div style={{textAlign: 'center', width: 100}}>
                        {visibility ? 'Public' : 'Private'}
                        <Switch
                            checked={visibility}
                            color='secondary'
                            onChange={handleCheckChange}
                        />
                    </div>
                </Stack>
            </CardContent>
        </Card>
    )
}

const pattern = /^[\sa-zA-Z0-9_-]{1,32}$/

export default EditProfilePage
