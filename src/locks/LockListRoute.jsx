import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import {lockFilterFields} from '../data/filterFields'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import {LockListProvider} from './LockListContext'
import {DataProvider} from './LockDataProvider'
import {FilterProvider} from '../context/FilterContext'
import Entries from './Entries'
import BeltToolbar from './BeltToolbar'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import allEntries from '../data/data.json'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import {lockSortFields} from '../data/sortFields'

function LockListRoute() {
    const {isMobile} = useWindowSize()
    const {lockCollection} = useContext(DBContext)
    usePageTitle('Locks')

    const extras = (
        <React.Fragment>
            <SearchBox label='Locks' extraFilters={[{key: 'tab', value: 'search'}]} keepOpen={false}/>
            <ViewFilterButtons sortValues={lockSortFields}
                               extraFilters={[{key: 'tab', value: 'search'}]}
                               compactMode={true} resetAll={true} expandAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={allEntries} profile={lockCollection}>
                <LockListProvider>
                    <Nav title='Locks' extras={extras}/>

                    <BeltToolbar/>

                    <Entries profile={lockCollection}/>

                    <Tracker feature='locks'/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default LockListRoute
