import React, {useContext} from 'react'
import Nav from '../nav/Nav.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import ViewLockRequests from './ViewLockRequests.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from './LockRequestsDataProvider.jsx'
import {lockRequestFilterFields} from '../data/filterFields'
import AuthContext from '../app/AuthContext.jsx'
import {useOutletContext} from 'react-router-dom'

export default function ViewLockRequestsRoute() {
    usePageTitle('View Ranking Requests')
    const {user, userClaims} = useContext(AuthContext)
    const requestMod = userClaims?.requestAdmin || userClaims?.admin
    const {isMobile} = useWindowSize()

    const rankingRequests = useOutletContext()

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockRequestFilterFields}>
            <DataProvider allEntries={rankingRequests}>
                <Nav title='Ranking Requests' extras={extras}/>

                <ViewLockRequests user={user} requestMod={requestMod}/>

            </DataProvider>
        </FilterProvider>
    )
}
