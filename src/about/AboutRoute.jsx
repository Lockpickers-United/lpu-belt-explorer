import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import AboutPage from './AboutPage.jsx'

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
