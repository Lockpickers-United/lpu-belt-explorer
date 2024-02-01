import LinearProgress from '@mui/material/LinearProgress'
import React, {useContext, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import AppContext from '../app/AppContext'
import AuthContext from '../app/AuthContext'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import lpuLogoPath from '../resources/LPU.png'
import SiteReportMain from './SiteReportMain.jsx'

function SiteReportRoute() {
    const {authLoaded} = useContext(AuthContext)
    const {admin} = useContext(AppContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (authLoaded && !admin) {
            //navigate('/locks')
        }
    }, [admin, authLoaded, navigate])

    return (
        <React.Fragment>
            <Nav title='Site Report'/>

            {!authLoaded &&
                <React.Fragment>
                    <LinearProgress variant='indeterminate' color='secondary'/>
                    <img alt='Loading' src={lpuLogoPath} style={{
                        marginLeft: 'auto', marginRight: 'auto', display: 'block'
                    }}/>
                </React.Fragment>
            }

            {authLoaded && admin && <SiteReportMain/>}

            <Footer/>

            <Tracker feature='siteReport'/>
        </React.Fragment>
    )
}

export default SiteReportRoute
