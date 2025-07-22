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
import DBContext from '../app/DBContext.jsx'

export default function ViewLockRequestsRoute() {
    usePageTitle('View Lock Requests')
    const {user, userClaims} = useContext(AuthContext)
    const {lockCollection} = useContext(DBContext)
    const requestMod = ['requestAdmin', 'admin'].some(claim => userClaims.includes(claim))
    const {isMobile} = useWindowSize()

    const rankingRequests = useOutletContext()

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockRequestFilterFields}>
            <DataProvider allEntries={rankingRequests} profile={lockCollection}>
                <Nav title='View Lock Requests' extras={extras}/>

                <ViewLockRequests user={user} requestMod={requestMod}/>

            </DataProvider>
        </FilterProvider>
    )
}
