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
import {ScorecardDataProvider} from './ScorecardDataProvider.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {ScorecardListProvider} from './ScorecardListContext.jsx'
import {lockFilterFields} from '../data/filterFields'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import SearchBox from '../nav/SearchBox.jsx'
import SortButton from '../filters/SortButton.jsx'
import {scorecardSortFields} from '../data/sortFields'
import FilterButton from '../filters/FilterButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

function ScorecardRoute() {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const {getProfile, evidence, getEvidence} = useContext(DBContext)
    const {lockCollection} = useContext(DBContext)
    const {isMobile} = useWindowSize()

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

    console.log('evidenceEntries', data)

    const nav = (
        <React.Fragment>
            <SearchBox label='Scorecard' extraFilters={[{key: 'tab', value: 'search'}]}/>
            <SortButton sortValues={scorecardSortFields}/>
            <FilterButton extraFilters={[{key: 'tab', value: 'search'}]}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth:'10px'}}/>}
        </React.Fragment>
    )

    const title = loading ? 'Loading...' : 'Scorecard'

    if (loading || error) {
        return null
    }

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <ScorecardDataProvider evidenceEntries={data} profile={lockCollection}>
                <ScorecardListProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <Nav title={title} extras={nav}/>

                        {loading && <LoadingDisplay/>}

                        {!loading && data && !error && <Scorecard owner={user && user.uid === userId} evidence={data}/>}
                        {!loading && (!data || error) && <ProfileNotFound/>}

                        <Footer/>
                    </LocalizationProvider>
                    <Tracker feature='scorecard'/>
                </ScorecardListProvider>
            </ScorecardDataProvider>
        </FilterProvider>
    )
}

export default ScorecardRoute