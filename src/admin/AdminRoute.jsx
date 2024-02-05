import LinearProgress from '@mui/material/LinearProgress'
import React, {useContext, useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import AppContext from '../app/AppContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import Tracker from '../app/Tracker.jsx'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import lpuLogoPath from '../resources/LPU.png'
import LightTheme from '../util/LightTheme.jsx'

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
