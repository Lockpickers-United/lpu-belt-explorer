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
    const {rankingRequests = []} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    usePageTitle('Lock Ranking Request')

    const requestData = rankingRequests
        .filter(request => request.makeModels && request.makeModels[0].make && request.makeModels[0].model)

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockRequestFilterFields}>
            <DataProvider allEntries={requestData} profile={lockCollection}>

                <Nav title='Lock Ranking Request' extras={extras}/>
                <RequestLock data={requestData}/>

            </DataProvider>
        </FilterProvider>
    )
}
