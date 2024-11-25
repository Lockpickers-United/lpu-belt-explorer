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
import raflData from '../data/rafl.json'
import useData from '../util/useData.jsx'
import {raflJsonUrl} from '../data/dataUrls'
import LoadingDisplay from '../misc/LoadingDisplay'
import AppContext from '../app/AppContext.jsx'
import PreviewButton from './PreviewButton.jsx'
import {useSearchParams} from 'react-router-dom'
import RafffleEntry from './RafffleEntry.jsx'
import RaffleHeader from './RaffleHeader.jsx'
import RafflePreviewBar from './RafflePreviewBar.jsx'
import RaffleStatsContext from './RaffleStatsContext.jsx'

function RaffleRoute() {
    usePageTitle('RAFL Prizes')
    const {preview} = useContext(AppContext)
    const {isMobile} = useWindowSize()
    const {lockCollection} = useContext(DBContext)
    const [searchParams] = useSearchParams()
    const single = searchParams.get('single')
    const id = searchParams.get('id')

    const {potStats} = useContext(RaffleStatsContext)

    const {data, loading, error, refresh} = useData({url: raflJsonUrl})
    const dataReady = (data && !loading && !error)
    const allEntries = preview && dataReady
        ? data || []
        : raflData

    const allEntriesMapped = allEntries.map(entry => {
        const entryStats = potStats?.find(stat => stat.id === entry.id)
        return {
            ...entry,
            tickets: entryStats?.tickets,
            donors: entryStats?.donors
        }
    })

    const individualPot = allEntries.find(e => e.id === id)
    const showSingle = (!!single && individualPot)

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <PreviewButton/>
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

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleDataProvider allEntries={allEntriesMapped} profile={lockCollection}>

                <div style={style}>
                    {showSingle &&
                        <RafffleEntry entry={individualPot} expanded={true} single={single}/>
                    }

                    {!showSingle &&
                        <React.Fragment>

                            <Nav title='RAFL' extras={extras} extrasTwo={extrasTwo}/>
                            <RaffleHeader page={'pots'}/>

                            {preview &&
                                <RafflePreviewBar refresh={refresh}/>
                            }

                            {preview && !dataReady
                                ? <LoadingDisplay/>
                                : <RafflePage profile={lockCollection}/>
                            }

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
