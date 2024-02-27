import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import {lockFilterFields} from '../data/filterFields'
import useWindowSize from '../util/useWindowSize'
import {LockListProvider} from './LockListContext'
import {DataProvider} from './LockDataProvider'
import {FilterProvider} from '../context/FilterContext'
import Entries from './Entries'
import ToggleCompactButton from './ToggleCompactButton'
import FilterButton from '../filters/FilterButton'
import SortButton from '../filters/SortButton'
import ExportButton from './ExportButton'
import HotkeyInfoButton from './HotkeyInfoButton'
import RandomEntryButton from './RandomEntryButton'
import SlideshowButton from './SlideshowButton'
import BeltToolbar from './BeltToolbar'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import allEntries from '../data/data.json'
import {lockSortFields} from '../data/sortFields'

function LockListRoute() {
    const {isMobile} = useWindowSize()
    const {lockCollection} = useContext(DBContext)

    const nav = (
        <React.Fragment>
            <SearchBox label='Locks' extraFilters={[{key: 'tab', value: 'search'}]}/>
            <SortButton sortValues={lockSortFields}/>
            <FilterButton extraFilters={[{key: 'tab', value: 'search'}]}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth:'10px'}}/>}
            <ToggleCompactButton/>
        </React.Fragment>
    )
    const footer = (
        <React.Fragment>
            <br/>
            <HotkeyInfoButton/>
            &nbsp;•&nbsp;
            <RandomEntryButton/>
            &nbsp;•&nbsp;
            <ExportButton/>
            &nbsp;•&nbsp;
            <SlideshowButton/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={allEntries} profile={lockCollection}>
                <LockListProvider>
                    <Nav title='Locks' extras={nav}/>

                    <BeltToolbar/>

                    <Entries profile={lockCollection}/>

                    <Footer extras={footer}/>

                    <Tracker feature='locks'/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default LockListRoute
