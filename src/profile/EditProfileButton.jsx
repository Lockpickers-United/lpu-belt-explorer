import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext'

function EditProfileButton() {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        navigate('/profile/edit')
    }, [navigate])

    if (userId !== user?.uid) return null
    return (
        <Tooltip title='Edit Profile' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <EditIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default EditProfileButton
