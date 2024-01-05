import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import PrivacyPage from './PrivacyPage'

function InfoRoute() {
    return (
        <React.Fragment>
            <Nav title='Privacy Policy'/>

            <PrivacyPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default InfoRoute
