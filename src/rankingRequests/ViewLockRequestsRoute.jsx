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
    usePageTitle('View Ranking Requests')

    const {user, userClaims} = useContext(AuthContext)
    const requestMod = userClaims?.requestAdmin || userClaims?.admin

    const {isMobile} = useWindowSize()
    const {rankingRequests = []} = useContext(DBContext)

    const requestData = rankingRequests
            .filter(request => request.makeModels && request.makeModels[0].make && request.makeModels[0].model)

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockRequestFilterFields}>
            <DataProvider allEntries={requestData}>
                <Nav title='Ranking Requests' extras={extras}/>

                <ViewLockRequests user={user} requestMod={requestMod}/>

            </DataProvider>
        </FilterProvider>
    )
}
