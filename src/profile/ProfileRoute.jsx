import React, {useCallback, useContext, useMemo} from 'react'
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

function ProfileRoute() {
    const {user} = useContext(AuthContext)
    const {userId} = useParams()
    const {getProfile} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    const loadFn = useCallback(async () => {
        try {
            const profile = await getProfile(userId)
            if (profile) {
                const ownerName = profile.displayName
                    ? profile.displayName.toLowerCase().endsWith('s')
                        ? `${profile.displayName}'`
                        : `${profile.displayName}'s`
                    : 'Anonymous'

                document.title = `LPU Belt Explorer - ${ownerName} Profile`
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
            <ViewFilterButtons sortValues={lockSortFields} advancedEnabled={true}
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <ToggleCompactButton/>
        </React.Fragment>
    )

    const title = loading ? 'Loading...' : 'Profile'

    const footerBefore = (
        <div style={{margin: '30px 0px'}}>
            <ExportButton text={true}/>
        </div>
    )

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={entries} profile={data}>
                <LockListProvider>
                    <Nav title={title} extras={nav}/>

                    {loading && <LoadingDisplay/>}

                    {!loading && data && !error && <ProfilePage profile={data} owner={user && user.uid === userId}/>}
                    {!loading && data && !error && entries.length === 0 && <NoProfileData/>}
                    {!loading && (!data || error) && <ProfileNotFound/>}

                    <Footer before={footerBefore}/>

                    <Tracker feature='profile'/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default ProfileRoute
