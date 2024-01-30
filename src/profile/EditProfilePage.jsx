import React, {useCallback, useContext, useEffect, useState} from 'react'
import Typography from '@mui/material/Typography'
import {enqueueSnackbar} from 'notistack'
import SaveIcon from '@mui/icons-material/Save'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import DBContext from '../app/DBContext'

function EditProfilePage() {
    const {lockCollection, updateProfileVisibility} = useContext(DBContext)
    const [displayName, setDisplayName] = useState('')

    useEffect(() => {
        setDisplayName(lockCollection.displayName)
    }, [lockCollection.displayName])

    const handleChange = useCallback(event => {
        const {value} = event.target
        setDisplayName(value)
    }, [])

    const handleFocus = useCallback(event => event.target.select(), [])

    const handleSave = useCallback(() => {
        try {
            if (displayName) {
                updateProfileVisibility(true, displayName)
            } else {
                updateProfileVisibility(false, '')
            }
            enqueueSnackbar('Updated profile.')
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile.')
        }
    }, [displayName, updateProfileVisibility])

    const error = !pattern.test(displayName)

    const helperText = error
        ? 'Display name must only include A-Z, 0-9, _ and -.'
        : displayName?.length > 0
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
                    Set a display name if you wish your profile to be public.
                    If you want your profile to be private, remove it.
                </Typography>
                <br/>
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
            </CardContent>
        </Card>
    )
}

const pattern = /^[\sa-zA-Z0-9_-]{0,32}$/

export default EditProfilePage
