import React from 'react'
import Footer from '../../nav/Footer.jsx'
import Nav from '../../nav/Nav.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import RecentChangesPage from './RecentChangesPage.jsx'
import Tracker from '../../app/Tracker.jsx'
import allEntries from '../../data/data.json'
import deletedEntries from '../../data/deletedEntries.json'

import {lockFilterFields} from '../../data/filterFields'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {DataProvider} from '../../locks/LockDataProvider.jsx'

function RecentChangesRoute() {
    usePageTitle('Recent Changes')

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={allEntries} deletedEntries={deletedEntries} profile={undefined}>
                <React.Fragment>
                    <Nav title='Recent Changes'/>

                    <RecentChangesPage allEntries={allEntries}/>

                    <Footer/>

                    <Tracker feature='recentChanges'/>

                </React.Fragment>
            </DataProvider>
        </FilterProvider>
    )
}

export default RecentChangesRoute
