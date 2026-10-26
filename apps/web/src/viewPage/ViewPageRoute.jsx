import React from 'react'
import Footer from '../nav/Footer'
import Tracker from '../app/Tracker.jsx'
import ViewPage from './ViewPage.jsx'

export default function ViewPageRoute() {


    return (
        <React.Fragment>

            <ViewPage/>

            <Footer/>

            <Tracker feature='viewPage'/>

        </React.Fragment>
    )
}