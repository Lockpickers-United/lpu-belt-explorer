import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import HowToPage from './HowToPage'
import Tracker from '../app/Tracker.jsx'

function InfoRoute() {
    usePageTitle('Scorecard How To')

    return (
        <React.Fragment>
            <Nav title='Scorecard'/>

            <HowToPage/>

            <Footer/>

            <Tracker feature='scorecard-howto'/>

        </React.Fragment>
    )
}

export default InfoRoute
