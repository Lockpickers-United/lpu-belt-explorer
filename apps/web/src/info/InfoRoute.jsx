import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import InfoPage from './InfoPage'
import Tracker from '../app/Tracker.jsx'
import {dialFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'

function InfoRoute() {
    usePageTitle('Belt Requirements')

    return (
        <FilterProvider filterFields={dialFilterFields}>
            <Nav title='Belt Requirements'/>

            <InfoPage/>

            <Footer/>

            <Tracker feature='beltRequirements'/>

        </FilterProvider>
    )
}

export default InfoRoute
