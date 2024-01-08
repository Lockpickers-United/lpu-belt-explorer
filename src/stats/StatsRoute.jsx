import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import StatsMainPage from './StatsMainPage.jsx'


function StatsRoute() {
    return (
        <React.Fragment>
            <Nav title='Stats & Insights'/>

            <StatsMainPage/>

            <Footer/>

            <Tracker feature='stats'/>
        </React.Fragment>
    )
}

export default StatsRoute
