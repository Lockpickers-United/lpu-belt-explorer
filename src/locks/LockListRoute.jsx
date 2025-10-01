import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import {lockFilterFields} from '../data/filterFields'
import usePageTitle from '../util/usePageTitle'
import {LockListProvider} from './LockListContext'
import {DataProvider} from './LockDataProvider'
import {FilterProvider} from '../context/FilterContext'
import allEntries from '../data/data.json'
import LockList from './LockList.jsx'


function LockListRoute() {
    const {lockCollection} = useContext(DBContext)
    usePageTitle('Locks')

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={allEntries} profile={lockCollection}>
                <LockListProvider>
                    <LockList/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default LockListRoute
