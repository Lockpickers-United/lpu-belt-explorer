import React from 'react'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import Glossary from './Glossary'

function StatsRoute() {
    return (
        <React.Fragment>
            <Nav title='Glossary of LPU Terms'/>

            <Glossary/>

            <Footer/>
        </React.Fragment>
    )
}

export default StatsRoute
