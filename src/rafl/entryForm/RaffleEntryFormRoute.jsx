import React, {useContext} from 'react'
import Tracker from '../../app/Tracker.jsx'
import Footer from '../../nav/Footer.jsx'
import Nav from '../../nav/Nav.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import RaffleHeader from '../RaffleHeader.jsx'
import RaffleEntryForm from './RaffleEntryForm.jsx'
import DBContext from '../../app/DBContext.jsx'
import {DBProviderRaffle} from '../DBContextRaffle.jsx'
import ReportButton from '../ReportButton.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminRoleButton from '../AdminRoleButton.jsx'
import RaffleNotLiveDialog from '../RaffleNotLiveDialog.jsx'

function RaffleEntryFormRoute() {
    const {lockCollection} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    usePageTitle('RAFL Entry Form')

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <ReportButton/>
            <AdminRoleButton/>
        </React.Fragment>
    )

    return (
        <React.Fragment>

            <Nav title='RAFL Entry Form' extras={extras}/>

            <RaffleHeader page={'entryform'}/>

            <RaffleEntryForm profile={lockCollection}/>

            <Footer/>

            <Tracker feature='raflForm'/>

            <RaffleNotLiveDialog/>

        </React.Fragment>
    )
}

export default RaffleEntryFormRoute
