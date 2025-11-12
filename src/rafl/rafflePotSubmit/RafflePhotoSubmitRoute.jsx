import React, {useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import RafflePhotoSubmit from './RafflePhotoSubmit.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import DBContext from '../../app/DBContext.jsx'
import AuthContext from '../../app/AuthContext.jsx'

export default function RafflePhotoSubmitRoute() {
    const {isMobile} = useWindowSize()

    const {lockCollection} = useContext(DBContext)
    const {user} = useContext(AuthContext)

    usePageTitle('RAFL Pot Photos')

    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider>
            <Nav title='RAFL Pot Photos' extras={extras}/>
            <RafflePhotoSubmit profile={lockCollection} user={user}/>
        </FilterProvider>
    )
}