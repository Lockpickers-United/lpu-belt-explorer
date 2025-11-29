import React, {useContext} from 'react'
import {raffleFilterFields} from '../../data/filterFields'
import {FilterProvider} from '../../context/FilterContext'
import Footer from '../../nav/Footer'
import Nav from '../../nav/Nav'
import usePageTitle from '../../util/usePageTitle'
import useWindowSize from '../../util/useWindowSize'
import RaffleDataProvider from '../RaffleDataProvider.jsx'
import RafflePotPreviewEntries from './RafflePotPreviewEntries.jsx'
import RaffleContext from '../RaffleContext.jsx'
import AdminToolButtons from '../AdminToolButtons.jsx'

function RaffleRoute() {
    usePageTitle('RAFL Pot Preview')

    const {allPots, allCharities} = useContext(RaffleContext)
    if (!allPots || !allCharities) return null

    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolButtons/>
        </React.Fragment>
    )
    const extrasTwo = undefined

    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }

    let navTitle = 'RAFL Pot Preview'

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleDataProvider allEntries={allPots}>
                <div style={style}>
                    <Nav title={navTitle} extras={extras} extrasTwo={extrasTwo}/>

                    <RafflePotPreviewEntries/>

                    <Footer/>
                </div>
            </RaffleDataProvider>
        </FilterProvider>
    )
}

export default RaffleRoute
