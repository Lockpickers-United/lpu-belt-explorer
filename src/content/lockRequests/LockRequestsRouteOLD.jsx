import React, {useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import IntroCopy from '../../misc/IntroCopy.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import RequestLock from './RequestLock.jsx'
import DataContext from '../../context/DataContext.jsx'
import allEntries from '../../data/data.json'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {DataProvider} from '../../locks/LockDataProvider.jsx'

export default function LockRequestsRouteOLD() {
    const {profile} = useContext(DataContext)
    const {isMobile} = useWindowSize()

    usePageTitle('LPU Belt Explorer - Request Lock')

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider>
            <DataProvider allEntries={allEntries}>
            <Nav title='Request Lock' extras={extras}/>

            {profile && !profile.photoCredit &&
                <div style={{marginTop: 20, padding: '0px 0px'}}>
                    <IntroCopy pageName={'photoUpload'} maxWidth={820}/>
                </div>
            }

            <RequestLock profile={profile}/>
            </DataProvider>
        </FilterProvider>
    )
}