import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer.jsx'
import Nav from '../nav/Nav.jsx'
import useWindowSize from '../util/useWindowSize'
import Glossary from './Glossary'
import GlossarySearchBox from './GlossarySearchBox'

function StatsRoute() {
    const {isMobile} = useWindowSize()

    const nav = (
        <React.Fragment>
            <GlossarySearchBox/>
            {!isMobile && <div style={{flexGrow: 1}}/>}
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
