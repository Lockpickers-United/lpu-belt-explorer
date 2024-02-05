import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import StatsMainPage from './StatsMainPage'


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
