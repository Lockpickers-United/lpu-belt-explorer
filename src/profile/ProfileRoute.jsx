import React, {useCallback, useContext, useMemo} from 'react'
import {useParams} from 'react-router-dom'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import {collectionOptions} from '../data/collectionTypes'
import allEntries from '../data/data.json'
import FilterButton from '../filters/FilterButton'
import {DataProvider} from '../locks/LockDataProvider'
import {FilterProvider} from '../context/FilterContext'
import {LockListProvider} from '../locks/LockListContext'
import ToggleCompactButton from '../locks/ToggleCompactButton'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import CopyProfileLinkButton from './CopyProfileLinkButton'
import EditProfileButton from './EditProfileButton'
import NoProfileData from './NoProfileData'
import ProfileNotFound from './ProfileNotFound'
import ProfilePage from './ProfilePage'

function ProfileRoute() {
    const {userId} = useParams()
    const {getProfile} = useContext(DBContext)

    const loadFn = useCallback(() => {
        return getProfile(userId)
    }, [getProfile, userId])
    const {data = {}, loading, error} = useData({loadFn})

    const entries = useMemo(() => {
        if (loading) return []
        const uniqueIds = new Set(collectionOptions
            .flatMap(({key}) => data[key]))
        return allEntries.filter(entry => uniqueIds.has(entry.id))
    }, [data, loading])

    const nav = (
        <React.Fragment>
            <FilterButton/>
            <ToggleCompactButton/>
            <EditProfileButton/>
            <CopyProfileLinkButton/>
        </React.Fragment>
    )

    const title = loading ? 'Loading...' : 'Profile'

    return (
        <React.Fragment>
            <FilterProvider>
                <DataProvider allEntries={entries} profile={data}>
                    <LockListProvider>
                        <Nav title={title} extras={nav}/>

                        {loading && <LoadingDisplay/>}

                        {!loading && data && !error && <ProfilePage profile={data}/>}
                        {!loading && data && !error && entries.length === 0 && <NoProfileData/>}
                        {!loading && error && <ProfileNotFound/>}

                        <Footer/>

                        <Tracker feature='profile'/>
                    </LockListProvider>
                </DataProvider>
            </FilterProvider>
        </React.Fragment>
    )
}

export default ProfileRoute
