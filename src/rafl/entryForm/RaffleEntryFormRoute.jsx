import React, {useContext} from 'react'
import Tracker from '../../app/Tracker.jsx'
import Footer from '../../nav/Footer.jsx'
import Nav from '../../nav/Nav.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import RaffleHeader from '../RaffleHeader.jsx'
import RaffleEntryForm from './RaffleEntryForm.jsx'
import DBContext from '../../app/DBContext.jsx'

function RaffleEntryFormRoute() {
    const {lockCollection} = useContext(DBContext)

    usePageTitle('RAFL Entry Form')
    const extras = null

    return (
        <React.Fragment>

            <Nav title='RAFL Entry Form' extras={extras}/>

            <RaffleHeader page={'entryform'}/>

            <RaffleEntryForm profile={lockCollection}/>

            <Footer/>

            <Tracker feature='raflForm'/>
        </React.Fragment>
    )
}

export default RaffleEntryFormRoute
