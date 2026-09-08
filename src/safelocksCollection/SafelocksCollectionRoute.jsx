import React, {useContext, useEffect, useMemo} from 'react'
import {useParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext.jsx'
import Tracker from '../app/Tracker'
import {dialFilterFields} from '../data/filterFields'
import {dialSortFields} from '../data/sortFields'
import {FilterProvider} from '../context/FilterContext'
import {LockListProvider} from '../locks/LockListContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import LoadingDisplay from '../util/LoadingDisplay'
import useWindowSize from '../util/useWindowSize'
import NoProfileData from '../profile/NoProfileData'
import ProfileNotFound from '../profile/ProfileNotFound'
import SafelocksCollectionPage from './SafelocksCollectionPage.jsx'
import SafelocksDataProvider from '../safelocks/SafelocksDataProvider.jsx'
import allEntries from '../data/safelocks.json'
import collectionOptions from '../data/collectionTypes'
import ProfileHeader from '../profile/ProfileHeader.jsx'
import ExportButton from '../locks/ExportButton.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import ProfileDataContext from '../app/ProfileDataContext.jsx'

function SafelocksCollectionRoute() {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)

    const {data, loading, error} = useContext(ProfileDataContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    useEffect(() => {
        if (profile) {
            const ownerName = profile.displayName && !profile['privacyAnonymous']
                ? profile?.displayName?.toLowerCase().endsWith('s')
                    ? `${profile.displayName}'`
                    : `${profile.displayName}'s`
                : 'Anonymous'
            document.title = `LPU Belt Explorer - ${ownerName} Safe Locks`
        }
    }, [profile])

    const entries = useMemo(() => {
        if (loading || !data) return []
        const uniqueIds = new Set(collectionOptions.safelocks.getCollected(profile))
        return allEntries.filter(entry => uniqueIds.has(entry.id))
    }, [data, loading, profile])

    const {isMobile} = useWindowSize()

    const nav = (
        <React.Fragment>
            <SearchBox label='Collection'/>
            <ViewFilterButtons sortValues={dialSortFields} advancedEnabled={true}
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const title = loading ? 'Loading...' : 'Profile'

    const footerBefore = (<div style={{margin: '30px 0px'}}><ExportButton text={true} profile={data} filename={'safeLocksData'}/></div>)

    if (loading || !data) {
        return <LoadingDisplay/>
    }

    return (
        <FilterProvider filterFields={dialFilterFields}>
            <SafelocksDataProvider allEntries={entries} profile={profile}>
                <LockListProvider>
                    <div style={{
                        maxWidth: 700, padding: 0, backgroundColor: '#000',
                        marginLeft: 'auto', marginRight: 'auto', marginTop: 0
                    }}>

                        <Nav title={title} extras={nav}/>

                        <ProfileHeader profile={profile} page={'safelocks'} owner={user && user.uid === userId}/>

                        {loading && <LoadingDisplay/>}

                        {!loading && data && !error && entries.length > 0 &&
                            <SafelocksCollectionPage profile={profile}/>}
                        {!loading && data && !error && entries.length === 0 &&
                            <NoProfileData collectionType={'safelocks'}/>}
                        {!loading && (!data || error) && <ProfileNotFound/>}

                        <Footer before={footerBefore}/>

                        <Tracker feature='profile'/>
                    </div>
                </LockListProvider>
            </SafelocksDataProvider>
        </FilterProvider>
    )
}

export default SafelocksCollectionRoute
