import React, {useCallback, useContext, useEffect, useMemo} from 'react'
import {useParams} from 'react-router-dom'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import collectionOptions from '../data/collectionTypes'
import allEntries from '../data/data.json'
import {lockFilterFields} from '../data/filterFields'
import {lockSortFields} from '../data/sortFields'
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
import AuthContext from '../app/AuthContext.jsx'
import ExportButton from '../locks/ExportButton.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import ProfileContext from '../app/ProfileContext.jsx'
import AppContext from '../app/AppContext.jsx'

function ProfileRoute() {
    const {user} = useContext(AuthContext)
    const {userId} = useParams()
    const {getPickerActivity} = useContext(DBContext)
    const {data, loading, error, isFullProfile} = useContext(ProfileContext)
    const {admin} = useContext(AppContext)

    const profile = useMemo(() => data ? data.profile : {}, [data])

    admin && console.log('ProfileRoute', {isFullProfile, data})

    const owner = user?.uid === userId

    useEffect(() => {
        if (profile) {
            const ownerName = profile.displayName && !profile['privacyAnonymous']
                ? profile?.displayName?.toLowerCase().endsWith('s')
                    ? `${profile.displayName}'`
                    : `${profile.displayName}'s`
                : 'Anonymous'
            document.title = `LPU Belt Explorer - ${ownerName} User Info`
        }
    }, [profile])

    const loadFn = useCallback(async () => {
        try {
            return await getPickerActivity(userId)
        } catch (ex) {
            console.error('Error loading pickerActivity.', ex)
            return null
        }
    }, [getPickerActivity, userId])

    const pickerActivity = useData({loadFn})

    const isLoading = pickerActivity?.loading || loading
    const isError = pickerActivity?.error || error

    const entries = useMemo(() => {
        if (loading || !profile) return []
        const uniqueIds = new Set(collectionOptions.locks.getCollected(profile))
        return allEntries.filter(entry => uniqueIds.has(entry.id))
    }, [profile, loading])

    const {isMobile} = useWindowSize()

    const nav = (
        <>
            <SearchBox label='Collection'/>
            <ViewFilterButtons sortValues={lockSortFields} advancedEnabled={true}
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <ToggleCompactButton/>
        </>
    )

    const title = isLoading ? 'Loading...' : 'Profile'

    const footerBefore = (
        <div style={{margin: '30px 0px'}}>
            <ExportButton text={true}/>
        </div>
    )

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={entries} profile={profile}>
                <LockListProvider>
                    <Nav title={title} extras={nav}/>

                    {isLoading && <LoadingDisplay/>}

                    {!isLoading && profile && !isError && <ProfilePage profile={profile} pickerActivity={pickerActivity?.data} owner={user && user.uid === userId}/>}
                    {!isLoading && profile && !isError && entries.length === 0 && <NoProfileData/>}
                    {!isLoading && (!profile || isError) && <ProfileNotFound/>}

                    <Footer before={footerBefore}/>

                    <Tracker feature='profile' own={owner}/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default ProfileRoute
