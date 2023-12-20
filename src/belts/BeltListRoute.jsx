import React from 'react'
import {AppProvider} from '../contexts/AppContext'
import {DataProvider} from '../contexts/DataContext'
import {FilterProvider} from '../contexts/FilterContext'
import Entries from './Entries'
import ToggleCompactButton from './ToggleCompactButton'
import FilterButton from '../filters/FilterButton'
import SortButton from '../filters/SortButton'
import InfoButton from '../info/InfoButton'
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

            <div style={{flexGrow: 1}}></div>

            <SortButton/>
            <FilterButton/>
            <ToggleCompactButton/>
        </React.Fragment>
    )
    const footer = (
        <React.Fragment>
            <br/>
            <InfoButton icon/>
            &nbsp;•&nbsp;
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
