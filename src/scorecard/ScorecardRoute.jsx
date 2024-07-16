import React, {useContext, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import useData from '../util/useData.jsx'
import Nav from '../nav/Nav.jsx'
import Footer from '../nav/Footer.jsx'
import Tracker from '../app/Tracker.jsx'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import Scorecard from './Scorecard.jsx'
import LoadingDisplay from '../util/LoadingDisplay.jsx'
import ProfileNotFound from '../profile/ProfileNotFound.jsx'
import {DataProvider} from '../locks/LockDataProvider.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {LockListProvider} from '../locks/LockListContext.jsx'
import {lockFilterFields} from '../data/filterFields.js'
import allEntries from '../data/data.json'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'

function ScorecardRoute() {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const {getProfile, evidence, getEvidence} = useContext(DBContext)

    const entries = allEntries

    const loadFn = useCallback(async () => {
        try {
            const profile = await getProfile(userId)
            const name = profile && profile.displayName ? profile.displayName : 'A Picker'
            document.title = `LPU Belt Explorer - ${name}'s Scorecard`

            if (user && user.uid === userId) {
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
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={entries} profile={data}>
                <LockListProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <Nav title={title}/>

                        {loading && <LoadingDisplay/>}

                        {!loading && data && !error && <Scorecard owner={user && user.uid === userId} evidence={data}/>}
                        {!loading && (!data || error) && <ProfileNotFound/>}

                        <Footer/>
                    </LocalizationProvider>
                    <Tracker feature='scorecard'/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default ScorecardRoute