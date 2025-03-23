import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import DansPage from './DansPage'
import Tracker from '../app/Tracker.jsx'

function DansRoute() {
    usePageTitle('Dan System')

    return (
        <React.Fragment>
            <Nav title='Dan System'/>

            <DansPage/>

            <Footer/>

            <Tracker feature='dans'/>

        </React.Fragment>
    )
}

export default DansRoute
