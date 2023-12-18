import React from 'react'
import BeltToolbar from '../nav/BeltToolbar'
import EntriesCompact from '../entries/EntriesCompact.jsx'
import ExportButton from '../misc/ExportButton'
import FilterButton from '../filters/FilterButton'
import Footer from '../nav/Footer'
import HotkeyInfoButton from '../misc/HotkeyInfoButton'
import InfoButton from '../info/InfoButton'
import Nav from '../nav/Nav'
import RandomEntryButton from '../misc/RandomEntryButton'
import SearchBox from '../nav/SearchBox'
import SlideshowButton from '../misc/SlideshowButton'
import SortButton from '../filters/SortButton'
import {AppProvider} from '../contexts/AppContext'
import {DataProvider} from '../contexts/DataContext'
import {FilterProvider} from '../contexts/FilterContext'
import {LazyDataProvider} from '../contexts/LazyDataContext'


function CompactRoute() {
    const nav = (
        <React.Fragment>
            <SearchBox/>

            <div style={{flexGrow: 1}}></div>

            <InfoButton icon/>
            <SortButton/>
            <FilterButton/>
        </React.Fragment>
    )
    const footer = (
        <React.Fragment>
            <br/>
            <HotkeyInfoButton/>&nbsp;•&nbsp;
            <RandomEntryButton/>&nbsp;•&nbsp;
            <ExportButton/>&nbsp;•&nbsp;
            <SlideshowButton/>
        </React.Fragment>
    )

    return (
        <LazyDataProvider>
            <FilterProvider>
                <DataProvider>
                    <AppProvider>
                        <Nav extras={nav}/>
                        <BeltToolbar/>

                        <EntriesCompact/>

                        <Footer extras={footer}/>
                    </AppProvider>
                </DataProvider>
            </FilterProvider>
        </LazyDataProvider>
    )
}

export default CompactRoute
