import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Entries from './Entries'
import BeltToolbar from './BeltToolbar'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import {lockSortFields} from '../data/sortFields'
import DataContext from './LockDataProvider.jsx'
import SearchCutoffBar from '../filters/SearchCutoffBar.jsx'

function LockList() {
    const {isMobile} = useWindowSize()
    const {lockCollection} = useContext(DBContext)
    const {visibleBeltEntries = []} = useContext(DataContext)

    const extras = (
        <React.Fragment>
            <SearchBox label='Locks' extraFilters={[{key: 'tab', value: 'search'}]} keepOpen={false}
                       entryCount={visibleBeltEntries.length}/>
            <ViewFilterButtons sortValues={lockSortFields} advancedEnabled={true}
                               extraFilters={[{key: 'tab', value: 'search'}]}
                               compactMode={true} resetAll={true} expandAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Locks' extras={extras}/>

            <BeltToolbar/>

            <SearchCutoffBar/>

            <Entries profile={lockCollection} advancedEnabled={true}/>

            <Tracker feature='locks'/>
        </React.Fragment>
    )
}

export default LockList
