import React from 'react'
import {AppProvider} from '../contexts/AppContext'
import {DataProvider} from '../contexts/DataContext'
import {FilterProvider} from '../contexts/FilterContext'
import {LazyDataProvider} from '../contexts/LazyDataContext'
import Entries from '../entries/Entries'
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

function BeltList() {
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
        <LazyDataProvider>
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
        </LazyDataProvider>
    )
}

export default BeltList
