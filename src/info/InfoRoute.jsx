import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import InfoPage from './InfoPage'
import Tracker from '../app/Tracker.jsx'

function InfoRoute() {
    usePageTitle('Belt Requirements')

    return (
        <React.Fragment>
            <Nav title='Belt Requirements'/>

            <InfoPage/>

            <Footer/>

            <Tracker feature='beltRequirements'/>

        </React.Fragment>
    )
}

export default InfoRoute
