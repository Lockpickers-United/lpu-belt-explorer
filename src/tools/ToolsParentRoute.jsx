import React, {useContext} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Link from '@mui/material/Link'
import Fade from '@mui/material/Fade'

function ToolsParentRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {adminRole} = useContext(DBContext)
    const navigate = useNavigate()

    return (
        <React.Fragment>

            {!authLoaded &&
                <LoadingDisplay/>
            }

            {authLoaded && adminRole && <Outlet/>}

            {authLoaded && !adminRole &&
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
