import React, {useContext, useCallback} from 'react'
import useData from '../util/useData.jsx'
import Footer from '../nav/Footer.jsx'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import {Outlet} from 'react-router-dom'

function BeltRequestsParentRoute() {
    const {user} = useContext(AuthContext)
    const {getProfile} = useContext(DBContext)

    const userId = user ? user.uid : null
    const loadFn = useCallback(async () => {
        if (!userId) return null
        try {
            return await getProfile(userId)
        } catch (ex) {
            console.error('Error loading profile.', ex)
            return null
        }
    }, [getProfile, userId])

    const {data = {}, loading, error} = useData({loadFn})
    const profile = data

    return (
        <React.Fragment>
            {loading && <LoadingDisplay/>}

            {!loading && !error &&
                <Outlet context={{profile, user}}/>
            }

            <Footer/>
        </React.Fragment>
    )
}

export default BeltRequestsParentRoute