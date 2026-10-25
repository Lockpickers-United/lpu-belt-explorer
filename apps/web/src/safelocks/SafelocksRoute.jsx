import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import {dialFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './SafelocksDataProvider.jsx'
import dials from '../data/safelocks.json'
import Safelocks from './Safelocks.jsx'

function SafelocksRoute() {
    const {lockCollection} = useContext(DBContext)
    usePageTitle('Safe Locks')

    return (
        <FilterProvider filterFields={dialFilterFields}>
            <DataProvider allEntries={dials} profile={lockCollection}>
                <Safelocks profile={lockCollection}/>
            </DataProvider>
        </FilterProvider>
    )
}

export default SafelocksRoute
