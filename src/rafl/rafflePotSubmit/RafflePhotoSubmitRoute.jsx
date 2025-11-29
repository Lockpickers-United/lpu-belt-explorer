import React, {useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import RafflePhotoSubmit from './RafflePhotoSubmit.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import DBContext from '../../app/DBContext.jsx'
import AuthContext from '../../app/AuthContext.jsx'
import AdminToolButtons from '../AdminToolButtons.jsx'
import Footer from '../../nav/Footer.jsx'

export default function RafflePhotoSubmitRoute() {
    const {isMobile} = useWindowSize()

    const {lockCollection} = useContext(DBContext)
    const {user} = useContext(AuthContext)

    usePageTitle('RAFL Pot Photos')

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolButtons/>
        </React.Fragment>
    )

    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }

    return (
        <FilterProvider>
            <div style={style}>
                <Nav title='RAFL Pot Photos' extras={extras}/>
                <RafflePhotoSubmit profile={lockCollection} user={user}/>
                <Footer/>
            </div>
        </FilterProvider>
    )
}