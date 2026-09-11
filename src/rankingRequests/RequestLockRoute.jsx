import React, {useContext, useMemo} from 'react'
import Nav from '../nav/Nav.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from './LockRequestsDataProvider.jsx'
import {lockRequestFilterFields} from '../data/filterFields'
import RequestLock from './RequestLock.jsx'
import allEntries from '../data/data.json'
import ProfileContext from '../app/ProfileContext.jsx'
import ProfileLoader from '../auth/ProfileLoader.jsx'

export default function RequestLockRoute() {

    usePageTitle('Request a Lock')

    const {isMobile} = useWindowSize()
    const {data, loading, error} = useContext(ProfileContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])


    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockRequestFilterFields}>
            <DataProvider allEntries={allEntries} profile={profile}>

                <Nav title='Request a Lock' extras={extras}/>

                <ProfileLoader loading={loading} error={error} required={true} dialogText={'to request a lock'}/>

                { !loading && !error &&
                    <RequestLock profile={profile}/>
                }

            </DataProvider>
        </FilterProvider>
    )
}
