import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import {lockAdditionalFilterKeys, lockFilterFields} from '../data/filterFields'
import usePageTitle from '../util/usePageTitle'
import {LockListProvider} from './LockListContext'
import {DataProvider} from './LockDataProvider'
import {FilterProvider} from '../context/FilterContext'
import defaultEntries from '../data/data.json'
import LockSearch from './LockSearch.jsx'

function LockSearchRoute({allEntries = defaultEntries}) {
    const {lockCollection} = useContext(DBContext)
    usePageTitle('Bulk Search')

    return (
        <FilterProvider filterFields={lockFilterFields} additionalFilterKeys={lockAdditionalFilterKeys}>
            <DataProvider allEntries={allEntries} profile={lockCollection}>
                <LockListProvider>
                    <LockSearch/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default LockSearchRoute
