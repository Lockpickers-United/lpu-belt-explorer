import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import DansPage from './DansPage'

function InfoRoute() {
    return (
        <React.Fragment>
            <Nav title='Dan System'/>

            <DansPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default InfoRoute
