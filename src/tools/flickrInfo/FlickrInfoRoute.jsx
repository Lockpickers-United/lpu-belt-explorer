import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import Tracker from '../../app/Tracker.jsx'
import FlickrInfoSubmit from './FlickrInfoSubmit.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'

function FlickrInfoRoute() {

    usePageTitle('Get Flickr Info')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Get Flickr Photoset Info' extras={nav}/>

                <FlickrInfoSubmit/>

            <Footer/>
            <Tracker feature='flickrInfo'/>
        </React.Fragment>
    )
}

export default FlickrInfoRoute