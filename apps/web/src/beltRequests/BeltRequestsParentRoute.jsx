import React from 'react'
import Footer from '../nav/Footer.jsx'
import {Outlet} from 'react-router-dom'
import {ProfileProvider} from '../app/ProfileContext.jsx'
import {BeltRequestDBProvider} from './BeltRequestDBContext.jsx'

function BeltRequestsParentRoute() {

    return (
        <React.Fragment>
            <ProfileProvider>
                <BeltRequestDBProvider>
                    <Outlet/>
                </BeltRequestDBProvider>
            </ProfileProvider>
            <Footer/>
        </React.Fragment>
    )
}

export default BeltRequestsParentRoute