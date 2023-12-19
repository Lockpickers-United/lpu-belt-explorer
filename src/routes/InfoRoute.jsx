import React from 'react'
import {AppProvider} from '../contexts/AppContext'
import {DataProvider} from '../contexts/DataContext'
import {FilterProvider} from '../contexts/FilterContext'
import {LazyDataProvider} from '../contexts/LazyDataContext'
import HotkeyInfoButton from '../misc/HotkeyInfoButton'
import RandomEntryButton from '../misc/RandomEntryButton'
import SlideshowButton from '../misc/SlideshowButton'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import InfoPage from '../info/InfoPage'

function InfoRoute() {
    const nav = (
        <React.Fragment>
            <div style={{flexGrow: 1}}></div>
        </React.Fragment>
    )
    const footer = (
        <React.Fragment>
            <br/>
            <HotkeyInfoButton/>
            &nbsp;•&nbsp;
            <RandomEntryButton/>
            &nbsp;•&nbsp;
            <SlideshowButton/>
        </React.Fragment>
    )

    return (
        <LazyDataProvider>
            <FilterProvider>
                <DataProvider>
                    <AppProvider>

                        <Nav extras={nav}  title='Information'/>
                        <InfoPage/>
                        <Footer extras={footer}/>

                    </AppProvider>
                </DataProvider>
            </FilterProvider>
        </LazyDataProvider>
    )
}

export default InfoRoute
