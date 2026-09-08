import React, {useContext} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Link from '@mui/material/Link'
import Fade from '@mui/material/Fade'

function ToolsParentRoute() {
    const {authLoaded, isLoggedIn, user, userClaims} = useContext(AuthContext)
    const navigate = useNavigate()
    const toolsUser = isLoggedIn && user && ['lpuAdmin', 'admin'].some(claim => userClaims.includes(claim))

    return (
        <>

            {!authLoaded &&
                <LoadingDisplay/>
            }

            {authLoaded && toolsUser &&
                <Outlet/>
            }

            {authLoaded && !toolsUser &&
                <Fade in={true} timeout={1000}>
                    <div style={{
                        width: '320px', textAlign: 'center',
                        padding: 50, marginTop: 100, backgroundColor: '#292929',
                        marginLeft: 'auto', marginRight: 'auto'
                    }}>
                        <Link onClick={() => navigate('/')}
                              style={{
                                  color: '#fff',
                                  textDecorationColor: '#bbb',
                                  cursor: 'pointer',
                                  fontSize: '1.0rem'
                              }}>
                            nothing to see here
                        </Link>
                    </div>
                </Fade>
            }

        </>
    )
}

export default ToolsParentRoute
