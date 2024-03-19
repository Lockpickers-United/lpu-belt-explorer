import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import AboutPage from './AboutPage'

function AboutRoute() {
    usePageTitle('About LPU Belts')

    return (
        <React.Fragment>

            <Nav title='About LPU Belts'/>
            <AboutPage/>
            <Footer/>

            <Tracker feature='about'/>

        </React.Fragment>
    )
}

export default AboutRoute
