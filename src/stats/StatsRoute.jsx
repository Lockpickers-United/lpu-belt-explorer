import React from 'react'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import StatsPage from './StatsPage.jsx'


function StatsRoute() {
    return (
        <React.Fragment>
            <Nav title='Stats for Nerds'/>

            <StatsPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default StatsRoute
