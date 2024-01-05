import React, {useCallback, useContext} from 'react'
import LoginIcon from '@mui/icons-material/Login'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import AuthContext from '../app/AuthContext'

function SignInButton({onClick}) {
    const {isLoggedIn, login} = useContext(AuthContext)

    const handleClick = useCallback(() => {
        onClick && onClick()
        login()
    }, [onClick, login])

    if (isLoggedIn) return null
    return (
        <MenuItem onClick={handleClick}>
            <ListItemIcon>
                <LoginIcon fontSize='small'/>
            </ListItemIcon>
            <ListItemText>Sign In with Google</ListItemText>
        </MenuItem>
    )
}

export default SignInButton
