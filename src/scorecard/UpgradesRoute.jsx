import React, {useContext} from 'react'
import DBContext from '../app/DBContext'
import Tracker from '../app/Tracker'
import {lockFilterFields} from '../data/filterFields'
import usePageTitle from '../util/usePageTitle'
import {LockListProvider} from '../locks/LockListContext'
import {DataProvider} from '../locks/LockDataProvider'
import {FilterProvider} from '../context/FilterContext'
import UpgradesPage from './UpgradesPage.jsx'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import allEntries from '../data/data.json'

function UpgradesRoute() {
    const {lockCollection} = useContext(DBContext)
    usePageTitle('Upgrades')

    const nav = null
    const footer = null

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={allEntries} profile={lockCollection}>
                <LockListProvider>
                    <Nav title='Upgrades' extras={nav}/>
                    
                    <UpgradesPage profile={lockCollection}/>

                    <Footer extras={footer}/>

                    <Tracker feature='upgrades'/>
                </LockListProvider>
            </DataProvider>
        </FilterProvider>
    )
}

export default UpgradesRoute
