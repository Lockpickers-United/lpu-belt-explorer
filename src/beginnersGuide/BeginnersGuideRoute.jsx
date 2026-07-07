import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import BeginnersGuide from './BeginnersGuide.jsx'

function BeginnersGuideRoute() {
    usePageTitle('Beginner\'s Guide')

    return (
        <React.Fragment>
            <Nav title="Beginner's Guide"/>

            <BeginnersGuide/>

            <Footer/>
        </React.Fragment>
    )
}

export default BeginnersGuideRoute
