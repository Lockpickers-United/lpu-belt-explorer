import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import LockyPrivacyPage from './LockyPrivacyPage'

function LockyPrivacyRoute() {
    usePageTitle('Locky Privacy Policy')

    return (
        <React.Fragment>
            <Nav title='Locky Bot Privacy Policy'/>

            <LockyPrivacyPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default LockyPrivacyRoute
