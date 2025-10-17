import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import SafelocksEntries from './SafelocksEntries.jsx'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import DataContext from '../context/DataContext.jsx'
import {dialSortFields} from '../data/sortFields'

export default function Safelocks() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = []} = useContext(DataContext)

    const extras = (
        <React.Fragment>
            <SearchBox label='Safe Locks' extraFilters={[{key: 'tab', value: 'search'}]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons sortValues={dialSortFields} advancedEnabled={true}
                               compactMode={true} resetAll={true} expandAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Safe Locks' extras={extras}/>

            <SafelocksEntries/>

            <Tracker feature='dials'/>
        </React.Fragment>
    )
}