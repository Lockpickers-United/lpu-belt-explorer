import React, {useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import IntroCopy from '../../misc/IntroCopy.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import PhotoSubmit from './PhotoSubmit.jsx'
import DataContext from '../../context/DataContext.jsx'
import allEntries from '../../data/data.json'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {DataProvider} from '../../locks/LockDataProvider.jsx'

export default function PhotoSubmitRoute() {
    const {profile} = useContext(DataContext)
    const {isMobile} = useWindowSize()

    usePageTitle('LPU Belt Explorer - Submit Photos')

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider>
            <DataProvider allEntries={allEntries}>
                <Nav title='Submit Photos' extras={extras}/>

                {profile && !profile.photoCredit &&
                    <div style={{marginTop: 20, padding: '0px 0px'}}>
                        <IntroCopy pageName={'photoUpload'} maxWidth={820}/>
                    </div>
                }

                <PhotoSubmit profile={profile}/>
            </DataProvider>
        </FilterProvider>
    )
}