import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import DialsPage from './DialsPage'

function DialsRoute() {
    return (
        <React.Fragment>
            <Nav title='Dials or something IDK'/>

            <DialsPage/>

            <Footer/>

            <Tracker feature='dials'/>
        </React.Fragment>
    )
}

export default DialsRoute
