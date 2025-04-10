import React, {useContext} from 'react'
import Nav from '../nav/Nav.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from './LockRequestsDataProvider.jsx'
import {lockRequestFilterFields} from '../data/filterFields'
import RequestLock from './RequestLock.jsx'
import DBContext from '../app/DBContext.jsx'

export default function RequestLockRoute() {
    const {lockCollection} = useContext(DBContext)
    const {rankingRequests} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    usePageTitle('LPU Belt Explorer - Lock Ranking Request')


    const requestCounts = rankingRequests.reduce((acc, request) => {
        acc[request.lockName] = (acc[request.lockName] || 0) + 1
        return acc
    }, {})

    const requestData = rankingRequests.map(request => ({
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

                <Nav title='Lock Ranking Request' extras={extras}/>
                <RequestLock data={requestData} profile={lockCollection}/>

            </DataProvider>
        </FilterProvider>
    )
}
