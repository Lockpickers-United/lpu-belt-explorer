import React, {useCallback, useContext} from 'react'
import LoginIcon from '@mui/icons-material/Login'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import MenuItem from '@mui/material/MenuItem'
import AuthContext from '../app/AuthContext'
import Link from '@mui/material/Link'

function SignInButton({onClick, linkText, menuItem = false}) {
    const {authLoaded, isLoggedIn, login} = useContext(AuthContext)

    const handleClick = useCallback(() => {
        onClick && onClick()
        login()
    }, [onClick, login])

    if (!authLoaded || isLoggedIn) return null

    const SignInControl = menuItem ? MenuItem : ListItemButton

    return (
        <React.Fragment>
            {linkText
                ? <Link onClick={handleClick} style={{
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                }}>
                    {linkText}
                </Link>
                : <SignInControl onClick={handleClick}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: menuItem ? 205 : 240}}>
                        <ListItemIcon>
                            <LoginIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText style={{whiteSpace: 'nowrap'}}>Sign In with Google</ListItemText>
                    </div>
                </SignInControl>
            }
        </React.Fragment>
    )
}

export default SignInButton
