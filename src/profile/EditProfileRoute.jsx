import LinearProgress from '@mui/material/LinearProgress'
import React, {useContext} from 'react'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import lpuLogoPath from '../resources/LPU.png'
import CopyProfileLinkButton from './CopyProfileLinkButton'
import EditProfilePage from './EditProfilePage'
import MustBeLoggedIn from './MustBeLoggedIn'

function ProfileRoute() {
    const {authLoaded, isLoggedIn} = useContext(AuthContext)
    const {dbLoaded} = useContext(DBContext)

    const nav = (
        <React.Fragment>
            <CopyProfileLinkButton/>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Edit Profile' extras={nav}/>

            {(!authLoaded || !dbLoaded) &&
                <React.Fragment>
                    <LinearProgress variant='indeterminate' color='secondary'/>
                    <img alt='Loading' src={lpuLogoPath} style={{
                        marginLeft: 'auto', marginRight: 'auto', display: 'block'
                    }}/>
                </React.Fragment>
            }

            {authLoaded && !isLoggedIn && <MustBeLoggedIn/>}
            {isLoggedIn && dbLoaded && <EditProfilePage/>}

            <Footer/>

            <Tracker feature='editprofile'/>
        </React.Fragment>
    )
}

export default ProfileRoute
