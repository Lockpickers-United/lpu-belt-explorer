import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import Glossary from './Glossary'

function StatsRoute() {
    return (
        <React.Fragment>
            <Nav title='Glossary'/>

            <Glossary/>

            <Footer/>

            <Tracker feature='glossary'/>
        </React.Fragment>
    )
}

export default StatsRoute
