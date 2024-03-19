import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import Glossary from './Glossary'
import GlossarySearchBox from './GlossarySearchBox'

function StatsRoute() {
    const {isMobile} = useWindowSize()
    usePageTitle('Glossary')

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
