import LinearProgress from '@mui/material/LinearProgress'
import React, {useContext, useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import lpuLogoPath from '../resources/LPU.png'

function AdminRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {adminRole} = useContext(DBContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (authLoaded && !adminRole) {
            navigate('/locks')
        }
    }, [adminRole, authLoaded, navigate])

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

            {authLoaded && adminRole && <Outlet/>}

            <Footer/>

            <Tracker feature='admin'/>
        </React.Fragment>
    )
}

export default AdminRoute
