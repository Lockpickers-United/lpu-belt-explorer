import React, {useCallback, useContext, useMemo} from 'react'
import {useParams} from 'react-router-dom'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import collectionOptions from '../data/collectionTypes'
import allEntries from '../data/data.json'
import {lockFilterFields} from '../data/filterFields'
import {lockSortFields} from '../data/sortFields'
import FilterButton from '../filters/FilterButton'
import SortButton from '../filters/SortButton'
import {DataProvider} from '../locks/LockDataProvider'
import {FilterProvider} from '../context/FilterContext'
import {LockListProvider} from '../locks/LockListContext'
import ToggleCompactButton from '../locks/ToggleCompactButton'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import useWindowSize from '../util/useWindowSize'
import NoProfileData from './NoProfileData'
import ProfileNotFound from './ProfileNotFound'
import ProfilePage from './ProfilePage'

function ProfileRoute() {
    const {userId} = useParams()
    const {getProfile} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    const loadFn = useCallback(async () => {
        try {
            const profile = await getProfile(userId)
            if (profile) {
                document.title = `LPU Belt Explorer - ${profile.displayName}'s Profile`
            }
            return profile
        } catch (ex) {
            console.error('Error loading profile.', ex)
            return null
        }
    }, [getProfile, userId])
    const {data = {}, loading, error} = useData({loadFn})

    const entries = useMemo(() => {
        if (loading || !data) return []
        const uniqueIds = new Set(collectionOptions.locks.getCollected(data))
        return allEntries.filter(entry => uniqueIds.has(entry.id))
    }, [data, loading])

    const nav = (
        <React.Fragment>
            <SearchBox label='Collection'/>
            <FilterButton/>
            <SortButton sortValues={lockSortFields}/>

            {!isMobile && <div style={{flexGrow: 1, minWidth:'10px'}}/>}
            <ToggleCompactButton/>
        </React.Fragment>
    )

    const title = loading ? 'Loading...' : 'Profile'

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={entries} profile={data}>
                <LockListProvider>
                    <Nav title={title} extras={nav}/>

                    {loading && <LoadingDisplay/>}

                    {!loading && data && !error && <ProfilePage profile={data}/>}
                    {!loading && data && !error && entries.length === 0 && <NoProfileData/>}
                    {!loading && (!data || error) && <ProfileNotFound/>}

                    <Footer/>

                    <Tracker feature='profile'/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default ProfileRoute
