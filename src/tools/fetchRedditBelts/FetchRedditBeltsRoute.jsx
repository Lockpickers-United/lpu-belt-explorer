import React from 'react'
import Nav from '../../nav/Nav.jsx'
import Footer from '../../nav/Footer.jsx'
import Tracker from '../../app/Tracker.jsx'
import FetchRedditBelts from './FetchRedditBelts.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import {useOutletContext} from 'react-router-dom'
import {
    discordBeltCounts, redditBeltCounts,
} from '../../data/dataUrls'
import ErrorMessage from '../../misc/ErrorMessage.jsx'
import LoadingDisplay from '../../util/LoadingDisplay.jsx'
import useData from '../../util/useData.jsx'

export default function FetchRedditBeltsRoute() {
    const {data, loading, error, errorMessage, refresh} = useData({urls})
    const {profile, user} = useOutletContext()

    usePageTitle('Fetch Reddit Belt Data')
    const nav = (
        <React.Fragment></React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Belt Distribution Data' extras={nav}/>

            {error && <ErrorMessage errorMessage={errorMessage}/>}

            {loading && <LoadingDisplay/>}

            {!loading && !error && !!data &&
                <FetchRedditBelts data={data} profile={profile} user={user} refresh={refresh}/>
            }

            <Footer/>
            <Tracker feature='redditBelts'/>
        </React.Fragment>
    )
}

const urls = {
    discordBeltCounts,
    redditBeltCounts,
}
