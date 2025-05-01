import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import Tracker from '../../app/Tracker.jsx'
import UploadRedditBeltData from './UploadRedditBeltData.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import {useOutletContext} from 'react-router-dom'

export default function UploadRedditBeltDataRoute() {

    const {profile, user} = useOutletContext()

    usePageTitle('Upload Reddit Belt Data')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Upload Reddit Belt Data' extras={nav}/>

                <UploadRedditBeltData profile={profile} user={user}/>

            <Footer/>
            <Tracker feature='flickrInfo'/>
        </React.Fragment>
    )
}