import React, {useCallback, useContext, useMemo} from 'react'
import {useParams} from 'react-router-dom'
import DBContext from '../app/DBContext'
import AuthContext from '../app/AuthContext.jsx'
import Tracker from '../app/Tracker'
import {dialFilterFields} from '../data/filterFields'
import {lockSortFields} from '../data/sortFields'
import FilterButton from '../filters/FilterButton'
import SortButton from '../filters/SortButton'
import {FilterProvider} from '../context/FilterContext'
import {LockListProvider} from '../locks/LockListContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import useWindowSize from '../util/useWindowSize'
import NoProfileData from '../profile/NoProfileData'
import ProfileNotFound from '../profile/ProfileNotFound'
import SafelocksCollectionPage from './SafelocksCollectionPage.jsx'
import SafelocksDataProvider from '../safelocks/SafelocksDataProvider.jsx'
import allEntries from '../data/safelocks.json'
import {safelockCollectionOptions} from '../data/collectionTypes'

function ProfileRoute() {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const {getProfile, lockCollection} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    const loadFn = useCallback(async () => {
        try {
            const profile = user?.uid !== userId ? await getProfile(userId) : lockCollection
            document.title = `LPU Belt Explorer - ${profile.displayName}'s Safe Locks`
            return profile
        } catch (ex) {
            console.error('Error loading profile.', ex)
            return null
        }
    }, [getProfile, lockCollection, user, userId])

    const {data = {}, loading, error} = useData({loadFn})

    const entries = useMemo(() => {
        if (loading || !data) return []
        const uniqueIds = new Set(safelockCollectionOptions
            .flatMap(({key}) => data[key]))
        return allEntries.filter(entry => uniqueIds.has(entry.id))
    }, [data, loading])

    const nav = (
        <React.Fragment>
            <SearchBox label='Collection'/>
            <FilterButton/>
            <SortButton sortValues={lockSortFields}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth:'10px'}}/>}
        </React.Fragment>
    )

    const title = loading ? 'Loading...' : 'Safe Locks'

    if (loading || !data) {
        return <LoadingDisplay/>
    }

    return (
        <FilterProvider filterFields={dialFilterFields}>
            <SafelocksDataProvider allEntries={entries} profile={data}>
                <LockListProvider>
                    <Nav title={title} extras={nav}/>

                    {loading && <LoadingDisplay/>}

                    {!loading && data && !error && entries.length > 0 && <SafelocksCollectionPage profile={data}/>}
                    {!loading && data && !error && entries.length === 0 && <NoProfileData collectionType={'safelocks'}/>}
                    {!loading && (!data || error) && <ProfileNotFound/>}

                    <Footer/>

                    <Tracker feature='profile'/>
                </LockListProvider>
            </SafelocksDataProvider>
        </FilterProvider>
    )
}

export default ProfileRoute
