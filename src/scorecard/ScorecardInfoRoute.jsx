import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import HowToPage from './HowToPage'
import Tracker from '../app/Tracker.jsx'
import {Outlet} from 'react-router-dom'

function ScorecardInfoRoute() {
    usePageTitle('Scorecard Info')

    return (
        <React.Fragment>
            <Nav title='Scorecard Info'/>

            <Outlet/>

            <Footer/>

            <Tracker feature='scorecard-info'/>

        </React.Fragment>
    )
}

export default ScorecardInfoRoute
