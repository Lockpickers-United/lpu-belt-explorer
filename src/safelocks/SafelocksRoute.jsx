import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import DBContext from '../app/DBContext'
import {dialFilterFields} from '../data/filterFields'
import {dialSortFields} from '../data/sortFields'
import FilterButton from '../filters/FilterButton'
import {FilterProvider} from '../context/FilterContext'
import SortButton from '../filters/SortButton'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import SafelocksDataProvider from './SafelocksDataProvider.jsx'
import SafelocksPage from './SafelocksPage.jsx'
import dials from '../data/safelocks.json'

function SafelocksRoute() {
    const {isMobile} = useWindowSize()
    const {lockCollection} = useContext(DBContext)
    usePageTitle('Safe Locks')

    const nav = (
        <React.Fragment>
            <SearchBox label='Safe Locks'/>
            <SortButton sortValues={dialSortFields}/>
            <FilterButton/>
            {!isMobile && <div style={{flexGrow: 1, minWidth:'10px'}}/>}
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={dialFilterFields}>
            <SafelocksDataProvider allEntries={dials} profile={lockCollection}>
                <Nav title='Safe Locks' extras={nav}/>

                <SafelocksPage profile={lockCollection}/>

                <Footer/>

                <Tracker feature='dials'/>
            </SafelocksDataProvider>
        </FilterProvider>
    )
}

export default SafelocksRoute
