import React, {useContext, useMemo} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import IntroCopy from '../../misc/IntroCopy.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import PhotoSubmit from './PhotoSubmit.jsx'
import allEntries from '../../data/data.json'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {DataProvider} from '../../locks/LockDataProvider.jsx'
import {useOutletContext} from 'react-router-dom'
import ProfileContext from '../../app/ProfileContext.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'

export default function PhotoSubmitRoute() {
    usePageTitle('Contribute Photos')

    const {user} = useOutletContext()
    const {data, loading} = useContext(ProfileContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    const {isMobile} = useWindowSize()

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

                {loading && <LoadingDisplay/>}

                <PhotoSubmit profile={profile} user={user}/>

            </DataProvider>
        </FilterProvider>
    )
}