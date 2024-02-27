import React from 'react'
import Tracker from '../app/Tracker'
import {dialFilterFields} from '../data/filterFields'
import FilterButton from '../filters/FilterButton'
import {FilterProvider} from '../context/FilterContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import useWindowSize from '../util/useWindowSize'
import DialDataProvider from './DialDataProvider'
import DialsPage from './DialsPage'
import dials from '../data/dials.json'

function DialsRoute() {
    const {isMobile} = useWindowSize()

    const nav = (
        <React.Fragment>
            <SearchBox label='Dials'/>
            <FilterButton/>
            {!isMobile && <div style={{flexGrow: 1, minWidth:'10px'}}/>}
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={dialFilterFields}>
            <DialDataProvider allEntries={dials}>
                <Nav title='Dials' extras={nav}/>

                <DialsPage/>

                <Footer/>

                <Tracker feature='dials'/>
            </DialDataProvider>
        </FilterProvider>
    )
}

export default DialsRoute