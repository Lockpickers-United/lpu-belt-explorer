import React from 'react'
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
import SearchBox from './SearchBox'

function LockListRoute() {
    const nav = (
        <React.Fragment>
            <SearchBox/>
            <SortButton/>
            <FilterButton/>
            <div style={{flexGrow: 1, minWidth:'10px'}}></div>
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
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default LockListRoute
