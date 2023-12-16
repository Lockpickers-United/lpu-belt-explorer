import React from 'react'
import {AppProvider} from '../contexts/AppContext'
import {DataProvider} from '../contexts/DataContext'
import {FilterProvider} from '../contexts/FilterContext'
import {LazyDataProvider} from '../contexts/LazyDataContext'
import Entries from '../entries/Entries'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'

function BeltList() {
    return (
        <LazyDataProvider>
            <FilterProvider>
                <DataProvider>
                    <AppProvider>
                        <Nav/>

                        <Entries/>

                        <Footer/>
                    </AppProvider>
                </DataProvider>
            </FilterProvider>
        </LazyDataProvider>
    )
}

export default BeltList
