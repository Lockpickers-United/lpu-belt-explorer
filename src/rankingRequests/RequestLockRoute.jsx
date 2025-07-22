import React, {useContext} from 'react'
import Nav from '../nav/Nav.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import usePageTitle from '../util/usePageTitle.jsx'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from './LockRequestsDataProvider.jsx'
import {lockRequestFilterFields} from '../data/filterFields'
import RequestLock from './RequestLock.jsx'
import DBContext from '../app/DBContext.jsx'
import allEntries from '../data/data.json'
import {useOutletContext} from 'react-router-dom'

export default function RequestLockRoute() {

    usePageTitle('Request a Lock')

    const {lockCollection} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    const rankingRequests = useOutletContext()
    const combinedEntries = allEntries.concat(rankingRequests)

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockRequestFilterFields}>
            <DataProvider allEntries={combinedEntries} profile={lockCollection}>

                <Nav title='Lock Requests' extras={extras}/>
                <RequestLock/>

            </DataProvider>
        </FilterProvider>
    )
}
