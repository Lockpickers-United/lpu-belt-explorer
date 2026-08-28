import React from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import BeltRequestSubmit from './BeltRequestSubmit.jsx'
import allEntries from '../../data/data.json'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {DataProvider} from '../../locks/LockDataProvider.jsx'
import {useOutletContext} from 'react-router-dom'

export default function BeltRequestSubmitRoute() {
    const {isMobile} = useWindowSize()

    const {profile, user} = useOutletContext()

    usePageTitle('Contribute Photos')

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider>
            <DataProvider allEntries={allEntries} profile={profile}>
                <Nav title='Belt Request' extras={extras}/>

                <BeltRequestSubmit profile={profile} user={user}/>

            </DataProvider>
        </FilterProvider>
    )
}