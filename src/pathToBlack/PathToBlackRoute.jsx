import React from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import PathToBlackPage from './PathToBlackPage'
import allEntries from '../data/data.json'
import {DataProvider} from '../locks/LockDataProvider.jsx'
import {lockFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'

export default function PathToBlackRoute() {
    usePageTitle('Path To Black')

    const nav = (
        <React.Fragment>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={allEntries}>
                <Nav title='Path To Black' extras={nav}/>

                <PathToBlackPage/>
                <Footer/>

                <Tracker feature='pathtoblack'/>
            </DataProvider>
        </FilterProvider>
    )
}


