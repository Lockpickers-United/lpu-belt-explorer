import LinearProgress from '@mui/material/LinearProgress'
import React, {useContext} from 'react'
import {useDocumentTitle} from 'usehooks-ts'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import lpuLogoPath from '../resources/LPU.png'
import CopyProfileLinkButton from './CopyProfileLinkButton'
import EditProfilePage from './EditProfilePage'
import MustBeLoggedIn from './MustBeLoggedIn'
import SystemMessage from '../systemMessage/SystemMessage.jsx'

function ProfileRoute() {
    const {authLoaded, isLoggedIn} = useContext(AuthContext)
    const {dbLoaded} = useContext(DBContext)
    useDocumentTitle('LPU Belt Explorer - Edit Profile')

    const nav = (
        <React.Fragment>
            <CopyProfileLinkButton page={'collection'}/>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Edit Profile' extras={nav}/>
            <SystemMessage/>

            {(!authLoaded || !dbLoaded) &&
                <React.Fragment>
                    <LinearProgress variant='indeterminate' color='secondary'/>
                    <img alt='Loading' src={lpuLogoPath} style={{
                        marginLeft: 'auto', marginRight: 'auto', display: 'block'
                    }}/>
                </React.Fragment>
            }

            {authLoaded && !isLoggedIn && <MustBeLoggedIn/>}
            {authLoaded && isLoggedIn && dbLoaded && <EditProfilePage/>}

            <Footer/>

            <Tracker feature='editprofile'/>
        </React.Fragment>
    )
}

export default ProfileRoute
