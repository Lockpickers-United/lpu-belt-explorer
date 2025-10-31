import React, {useCallback, useContext} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Link from '@mui/material/Link'
import Fade from '@mui/material/Fade'
import useData from '../util/useData.jsx'

function ToolsParentRoute() {
    const {authLoaded, isLoggedIn, user, userClaims} = useContext(AuthContext)
    const {adminRole, getProfile} = useContext(DBContext)
    const navigate = useNavigate()
    const userId = user ? user.uid : null
    const loadFn = useCallback(async () => {
        if (!userId) return null
        try {
            return await getProfile(userId)
        } catch (ex) {
            console.error('Error loading profile.', ex)
            return null
        }
    }, [getProfile, userId])
    const {data = {}, loading, error} = useData({loadFn}) // eslint-disable-line
    const profile = data

    const toolsUser = isLoggedIn && user && (['lpuAdmin', 'admin'].some(claim => userClaims.includes(claim)) || adminRole)

    return (
        <React.Fragment>

            {!authLoaded &&
                <LoadingDisplay/>
            }

            {authLoaded && toolsUser && <Outlet context={{profile, user}}/>}

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

        </React.Fragment>
    )
}

export default ToolsParentRoute
