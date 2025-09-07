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
import {raffleEntryFilterFields} from '../../data/filterFields.js'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {RaffleAdminDBProvider} from './RaffleAdminDBContext.jsx'
import RaffleAdminDataProvider from './RaffleAdminDataProvider.jsx'

export default function RaffleEditEntryRoute() {
    const {lockCollection} = useContext(DBContext)
    const {isMobile} = useWindowSize()

    usePageTitle('RAFL Entry Form')

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolsButton/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleEntryFilterFields}>
            <RaffleAdminDBProvider>
                <RaffleAdminDataProvider>
                    <React.Fragment>

                        <Nav title='RAFL Edit Entry' extras={extras}/>

                        <RaffleHeader page={'entryform'}/>

                        <RaffleEntryForm profile={lockCollection}/>

                        <Footer/>

                    </React.Fragment>
                </RaffleAdminDataProvider>
            </RaffleAdminDBProvider>
        </FilterProvider>

    )
}

