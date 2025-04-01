import React, {useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import DataContext from '../../context/DataContext.jsx'
import {requestedLocks} from '../../data/dataUrls'
import useData from '../../util/useData.jsx'
import ViewLockRequests from './ViewLockRequests.jsx'
import ErrorMessage from '../../misc/ErrorMessage.jsx'
import LoadingDisplay from '../../util/LoadingDisplay.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {DataProvider} from './LockRequestsDataProvider.jsx'
import {lockRequestFilterFields} from '../../data/filterFields'


export default function ViewLockRequestsRoute() {
    const {profile} = useContext(DataContext)
    const {isMobile} = useWindowSize()

    usePageTitle('LPU Belt Explorer - View Ranking Requests')

    const {data, loading, error, errorMessage, refresh} = useData({url})

    const requestCounts = data?.reduce((acc, request) => {
        acc[request.lockName] = (acc[request.lockName] || 0) + 1
        return acc
    }, {})

    const requestData = data?.map(request => ({
        ...request,
        requestCount: requestCounts[request.lockName],
        danPoints: 0
    })) || []

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockRequestFilterFields}>
            <DataProvider allEntries={requestData}>
                <Nav title='View Ranking Requests' extras={extras}/>

                {error && <ErrorMessage errorMessage={errorMessage}/>}

                {loading && <LoadingDisplay/>}

                {!loading && !error && !!data &&
                    <ViewLockRequests data={requestData} profile={profile} refresh={refresh}/>
                }

            </DataProvider>
        </FilterProvider>
    )
}

const url = requestedLocks