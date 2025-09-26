import React, {useContext} from 'react'
import Tracker from '../../app/Tracker.jsx'
import Footer from '../../nav/Footer.jsx'
import Nav from '../../nav/Nav.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import RaffleHeader from '../RaffleHeader.jsx'
import RaffleEntryForm from './RaffleEntryForm.jsx'
import DBContext from '../../app/DBContext.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminToolsButton from '../AdminToolsButton.jsx'
import RaffleNotLiveDialog from '../RaffleNotLiveDialog.jsx'

function RaffleEntryFormRoute() {
    const {lockCollection} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    usePageTitle('RAFL Entry Form')

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolsButton/>
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
        <div style={style}>

            <Nav title='RAFL Entry Form' extras={extras}/>

            <RaffleHeader page={'entryform'}/>

            <RaffleEntryForm profile={lockCollection}/>

            <Footer/>

            <Tracker feature='raflForm'/>

            <RaffleNotLiveDialog/>

        </div>
    )
}

export default RaffleEntryFormRoute
