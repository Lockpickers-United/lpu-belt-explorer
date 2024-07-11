import React, {useContext, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import useData from '../util/useData'
import Nav from '../nav/Nav'
import Footer from '../nav/Footer'
import Tracker from '../app/Tracker'
import DBContext from '../app/DBContext'
import Scorecard from './Scorecard'
import LoadingDisplay from '../util/LoadingDisplay'
import ProfileNotFound from './ProfileNotFound'
import tonyEvidence from '../data/dancache/Tonysansan.json'


function getEvidenceForUser(uid) {
    return tonyEvidence.entries.map(ent => {
        return {
            id: Math.floor(Math.random() * 100000),
            matchId: ent.id,
            name: ent.lock,
            link: ent.link,
            modifier: ent.modifier,
            date: ent.publishDate
        }
    })
}

function ScorecardRoute() {
    const {userId} = useParams()
    const {getProfile} = useContext(DBContext)

    const loadFn = useCallback(async () => {
        try {
            const profile = await getProfile(userId)
            document.title = `LPU Belt Explorer - ${profile.displayName}'s Scorecard`
            return profile
        } catch (ex) {
            console.error('Error loading profile.', ex)
            return null
        }
    }, [getProfile, userId])
    const {userData = {}, loading, error} = useData({loadFn})

    const title = loading ? 'Loading...' : 'Scorecard'

    const evidence = getEvidenceForUser(userId)

    return (
        <React.Fragment>
            <Nav title={title}/>

            {loading && <LoadingDisplay/>}

            {!loading && userData && !error && <Scorecard evidenceData={evidence}/>}
            {!loading && (!userData || error) && <ProfileNotFound/>}

            <Footer/>

            <Tracker feature='scorecard'/>
        </React.Fragment>
    )
}

export default ScorecardRoute