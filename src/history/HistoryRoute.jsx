import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'

function StatsRoute() {
    return (
        <React.Fragment>
            <Nav title='History of LPU Belts'/>

            <div>Coming soon...</div>

            <Footer/>

            <Tracker feature='history'/>
        </React.Fragment>
    )
}

export default StatsRoute
