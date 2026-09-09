import React from 'react'
import Footer from '../nav/Footer.jsx'
import {Outlet} from 'react-router-dom'
import {ProfileProvider} from '../app/ProfileContext.jsx'

function BeltRequestsParentRoute() {

    return (
        <React.Fragment>
            <ProfileProvider>
                <Outlet/>
            </ProfileProvider>
            <Footer/>
        </React.Fragment>
    )
}

export default BeltRequestsParentRoute