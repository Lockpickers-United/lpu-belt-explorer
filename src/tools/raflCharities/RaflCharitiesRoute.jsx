import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import RaflCharitiesCheck from './RaflCharitiesCheck.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'

function FlickrInfoRoute() {

    usePageTitle('Check Rafl Charities')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Check Rafl Charities' extras={nav}/>

                <RaflCharitiesCheck/>

            <Footer/>
        </React.Fragment>
    )
}

export default FlickrInfoRoute