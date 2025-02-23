import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import DBContext from '../app/DBContext'
import {raffleFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleDataProvider from './RaffleDataProvider.jsx'
import RafflePage from './RafflePage.jsx'
import {useSearchParams} from 'react-router-dom'
import RafffleEntry from './RaffleEntry.jsx'
import RaffleHeader from './RaffleHeader.jsx'
import RafflePreviewBar from './RafflePreviewBar.jsx'
import RaffleContext from './RaffleContext.jsx'
import PreviewButton from './PreviewButton.jsx'
import ReportButton from './ReportButton.jsx'
import AdminRoleButton from './AdminRoleButton.jsx'

function RaffleRoute() {
    usePageTitle('RAFL Prizes')
    const {preview, allPots, raflState, refresh} = useContext(RaffleContext)
    const {lockCollection} = useContext(DBContext)
    const {isMobile} = useWindowSize()
    const [searchParams] = useSearchParams()
    const single = searchParams.get('single')
    const id = searchParams.get('id')
    const previewMode = searchParams.has('preview')
    const showPreview = preview || previewMode

    const allEntries = allPots

    const individualPot = allEntries.find(e => e.id === id)
    const showSingle = (!!single && individualPot)

    const extras = (
        <React.Fragment>
            <React.Fragment>
                {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
                <PreviewButton/>
                <ReportButton/>
                <AdminRoleButton/>
            </React.Fragment>
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

    let navTitle = raflState === 'post'
        ? 'RAFL 2025 has ended'
        : ['live','setup'].includes(raflState) || !isMobile
            ? 'RAFL 2025!'
            : 'Announcing RAFL 2025!'

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleDataProvider allEntries={allEntries} profile={lockCollection}>

                <div style={style}>
                    {showSingle &&
                        <RafffleEntry entry={individualPot} expanded={true} single={single}/>
                    }

                    {!showSingle &&
                        <React.Fragment>

                            <Nav title={navTitle} extras={extras} extrasTwo={extrasTwo}/>
                            <RaffleHeader page={'pots'}/>

                            {showPreview &&
                                <RafflePreviewBar refresh={refresh}/>
                            }

                            <RafflePage profile={lockCollection}/>

                            <Footer/>
                        </React.Fragment>
                    }
                    <Tracker feature='rafl'/>
                </div>
            </RaffleDataProvider>
        </FilterProvider>
    )
}

export default RaffleRoute
