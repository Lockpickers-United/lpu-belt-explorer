import LinearProgress from '@mui/material/LinearProgress'
import React, {useContext, useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import AppContext from '../app/AppContext'
import AuthContext from '../app/AuthContext'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import lpuLogoPath from '../resources/LPU.png'
import LightTheme from '../util/LightTheme'

function AdminRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {admin} = useContext(AppContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (authLoaded && !admin) {
            navigate('/locks')
        }
    }, [admin, authLoaded, navigate])

    return (
        <React.Fragment>
            <Nav title='Admin'/>

            {!authLoaded &&
                <React.Fragment>
                    <LinearProgress variant='indeterminate' color='secondary'/>
                    <img alt='Loading' src={lpuLogoPath} style={{
                        marginLeft: 'auto', marginRight: 'auto', display: 'block'
                    }}/>
                </React.Fragment>
            }

            {authLoaded && admin && <Outlet/>}

            <Footer/>

            <Tracker feature='admin'/>
            <LightTheme></LightTheme>
        </React.Fragment>
    )
}

export default AdminRoute
