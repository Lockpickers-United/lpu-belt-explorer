import React, {useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import RafflePotSubmit from './RafflePotSubmit.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import DBContext from '../../app/DBContext.jsx'
import AuthContext from '../../app/AuthContext.jsx'
import AdminToolButtons from '../AdminToolButtons.jsx'
import Footer from '../../nav/Footer.jsx'

export default function RafflePotSubmitRoute() {
    const {isMobile} = useWindowSize()

    const {lockCollection} = useContext(DBContext)
    const {user} = useContext(AuthContext)

    usePageTitle('RAFL Pot Info')

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolButtons/>
        </React.Fragment>
    )

    return (
        <FilterProvider>
            <Nav title='RAFL Pot Info' extras={extras}/>
            <RafflePotSubmit profile={lockCollection} user={user}/>
            <Footer/>
        </FilterProvider>
    )
}