import React from 'react'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import StatsMainPage from './StatsMainPage.jsx'


function StatsRoute() {
    return (
        <React.Fragment>
            <Nav title='Stats & Insights'/>

            <StatsMainPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default StatsRoute
