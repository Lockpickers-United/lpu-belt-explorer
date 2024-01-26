import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import InfoPage from './InfoPage'

function InfoRoute() {
    return (
        <React.Fragment>
            <Nav title='Belt Requirements'/>

            <InfoPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default InfoRoute
