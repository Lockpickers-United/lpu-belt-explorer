import React from 'react'
import Tracker from '../app/Tracker'
import {LockListProvider} from './LockListContext'
import {DataProvider} from './DataContext'
import {FilterProvider} from './FilterContext'
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
import LockListSearchBox from './LockListSearchBox'

function LockListRoute() {
    const nav = (
        <React.Fragment>
            <LockListSearchBox/>
            <SortButton/>
            <FilterButton/>
            <div style={{flexGrow: 1, minWidth:'10px'}}/>
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
        <FilterProvider>
            <DataProvider>
                <LockListProvider>
                    <Nav extras={nav}/>

                    <BeltToolbar/>

                    <Entries/>

                    <Footer extras={footer}/>

                    <Tracker feature='locks'/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default LockListRoute
