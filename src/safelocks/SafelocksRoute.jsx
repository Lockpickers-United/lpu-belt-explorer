import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import DBContext from '../app/DBContext'
import {dialFilterFields} from '../data/filterFields'
import {dialSortFields} from '../data/sortFields'
import {FilterProvider} from '../context/FilterContext'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import SafelocksDataProvider from './SafelocksDataProvider.jsx'
import SafelocksEntries from './SafelocksEntries.jsx'
import dials from '../data/safelocks.json'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'

function SafelocksRoute() {
    const {isMobile} = useWindowSize()
    const {lockCollection} = useContext(DBContext)
    usePageTitle('Safe Locks')

    const extras = (
        <React.Fragment>
            <SearchBox label='Safe Locks'/>
            <ViewFilterButtons sortValues={dialSortFields} compactMode={false} expandAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )
    const extrasTwo = (
        <React.Fragment>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={dialFilterFields}>
            <SafelocksDataProvider allEntries={dials} profile={lockCollection}>

                <Nav title='Safe Locks' extras={extras} extrasTwo={extrasTwo}/>

                <SafelocksEntries profile={lockCollection}/>

                <Tracker feature='dials'/>
            </SafelocksDataProvider>
        </FilterProvider>
    )
}

export default SafelocksRoute
