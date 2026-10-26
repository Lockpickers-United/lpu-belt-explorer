import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import PrivacyPage from './PrivacyPage'

function PrivacyRoute() {
    usePageTitle('Privacy Policy')

    return (
        <React.Fragment>
            <Nav title='Privacy Policy'/>

            <PrivacyPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default PrivacyRoute
