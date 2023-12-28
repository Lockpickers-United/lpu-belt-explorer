import React from 'react'
import {AppProvider} from '../contexts/AppContext'
import {DataProvider} from '../contexts/DataContext'
import {FilterProvider} from '../contexts/FilterContext'
import Entries from './Entries'
import ToggleCompactButton from './ToggleCompactButton'
import FilterButton from '../filters/FilterButton'
import SortButton from '../filters/SortButton'
import ExportButton from '../misc/ExportButton'
import HotkeyInfoButton from '../misc/HotkeyInfoButton'
import RandomEntryButton from '../misc/RandomEntryButton'
import SlideshowButton from '../misc/SlideshowButton'
import BeltToolbar from '../nav/BeltToolbar'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'

function BeltListRoute() {
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
                <AppProvider>
                    <Nav extras={nav}/>
                    <BeltToolbar/>

                    <Entries/>

                    <Footer extras={footer}/>
                </AppProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default BeltListRoute
