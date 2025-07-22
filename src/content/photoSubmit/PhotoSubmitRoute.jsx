import React from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import IntroCopy from '../../misc/IntroCopy.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import PhotoSubmit from './PhotoSubmit.jsx'
import allEntries from '../../data/data.json'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {DataProvider} from '../../locks/LockDataProvider.jsx'
import {useOutletContext} from 'react-router-dom'

export default function PhotoSubmitRoute() {
    const {isMobile} = useWindowSize()

    const {profile, user} = useOutletContext()

    usePageTitle('Contribute Photos')

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider>
            <DataProvider allEntries={allEntries} profile={profile}>
                <Nav title='Contribute Photos' extras={extras}/>

                {profile && !profile.photoCredit &&
                    <div style={{marginTop: 20, padding: '0px 0px'}}>
                        <IntroCopy pageName={'photoUpload'} maxWidth={820}/>
                    </div>
                }

                <PhotoSubmit profile={profile} user={user}/>
            </DataProvider>
        </FilterProvider>
    )
}