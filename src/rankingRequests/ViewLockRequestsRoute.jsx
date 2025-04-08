import React, {useContext} from 'react'
import Nav from '../nav/Nav.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import ViewLockRequests from './ViewLockRequests.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from './LockRequestsDataProvider.jsx'
import {lockRequestFilterFields} from '../data/filterFields'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'

export default function ViewLockRequestsRoute() {
    usePageTitle('LPU Belt Explorer - View Ranking Requests')

    const {user, userClaims} = useContext(AuthContext)
    const requestMod = userClaims?.requestAdmin || userClaims?.admin


    const {isMobile} = useWindowSize()
    const {rankingRequests, rankingRequestsAccepted} = useContext(DBContext)

    const allRankingRequests = rankingRequestsAccepted?.concat(rankingRequests) || []
    const requestCounts = allRankingRequests?.reduce((acc, request) => {
        acc[request.lockName] = (acc[request.lockName] || 0) + 1
        return acc
    }, {})

    const requestData = allRankingRequests
        .filter(request => request.makeModels && request.makeModels[0].make && request.makeModels[0].model)
        .map(request => ({
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

                <ViewLockRequests user={user} requestMod={requestMod}/>

            </DataProvider>
        </FilterProvider>
    )
}
