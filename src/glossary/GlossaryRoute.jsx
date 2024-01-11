import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import Glossary from './Glossary'
import GlossarySearchBox from './GlossarySearchBox'

function StatsRoute() {
    const nav = (
        <React.Fragment>
            <GlossarySearchBox/>
            <div style={{flexGrow: 1}}/>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Glossary' extras={nav}/>

            <Glossary/>

            <Footer/>

            <Tracker feature='glossary'/>
        </React.Fragment>
    )
}

export default StatsRoute
