import React, {useContext, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import useData from '../util/useData'
import Nav from '../nav/Nav'
import Footer from '../nav/Footer'
import Tracker from '../app/Tracker'
import DBContext from '../app/DBContext'
import AuthContext from '../app/AuthContext'
import Scorecard from './Scorecard'
import LoadingDisplay from '../util/LoadingDisplay'
import ProfileNotFound from './ProfileNotFound'

function ScorecardRoute() {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const {getProfile, evidence, getEvidence} = useContext(DBContext)

    const loadFn = useCallback(async () => {
        try {
            const profile = await getProfile(userId)
            const name = profile && profile.displayName ? profile.displayName : "A Picker"
            document.title = `LPU Belt Explorer - ${name}'s Scorecard`

            if (user && user.uid == userId) {
                return evidence
            } else {
                return await getEvidence(userId)
            }
        } catch (ex) {
            console.error('Error loading profile and evidence.', ex)
            return null
        }
    }, [getProfile, user, userId, evidence, getEvidence])
    const {data = {}, loading, error} = useData({loadFn})

    const title = loading ? 'Loading...' : 'Scorecard'

    return (
        <React.Fragment>
            <Nav title={title}/>

            {loading && <LoadingDisplay/>}

            {!loading && data && !error && <Scorecard owner={user && user.uid === userId} evidence={data}/>}
            {!loading && (!data || error) && <ProfileNotFound/>}

            <Footer/>

            <Tracker feature='scorecard'/>
        </React.Fragment>
    )
}

export default ScorecardRoute