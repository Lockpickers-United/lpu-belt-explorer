import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import DansPage from './DansPage'

function InfoRoute() {
    usePageTitle('Dan System')

    return (
        <React.Fragment>
            <Nav title='Dan System'/>

            <DansPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default InfoRoute
