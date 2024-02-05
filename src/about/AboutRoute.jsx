import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import AboutPage from './AboutPage'

function AboutRoute() {
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
