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
    const {data = {}, loading, error} = useData({loadFn})

    const title = loading ? 'Loading...' : 'Scorecard'

    return (
        <React.Fragment>
            <Nav title={title}/>

            {loading && <LoadingDisplay/>}

            {!loading && data && !error && <Scorecard owner={user.uid === userId}/>}
            {!loading && (!data || error) && <ProfileNotFound/>}

            <Footer/>

            <Tracker feature='scorecard'/>
        </React.Fragment>
    )
}

export default ScorecardRoute