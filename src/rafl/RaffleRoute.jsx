import React, {useCallback, useContext} from 'react'
import Tracker from '../app/Tracker'
import DBContext from '../app/DBContext'
import {raffleFilterFields} from '../data/filterFields'
import {raffleSortFields} from '../data/sortFields'
import {FilterProvider} from '../context/FilterContext'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleDataProvider from './RaffleDataProvider.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import RafflePage from './RafflePage.jsx'
import raflData from '../data/rafl.json'
import useData from '../util/useData.jsx'
import {raflJsonUrl} from '../data/dataUrls'
import LoadingDisplay from '../misc/LoadingDisplay'
import AppContext from '../app/AppContext.jsx'
import PreviewButton from './PreviewButton.jsx'
import IconButton from '@mui/material/IconButton'
import CachedIcon from '@mui/icons-material/Cached'

function RaffleRoute() {
    usePageTitle('RAFL')
    const {preview} = useContext(AppContext)
    const {isMobile} = useWindowSize()
    const {lockCollection} = useContext(DBContext)

    const {data, loading, error, refresh} = useData({url: raflJsonUrl})
    const dataReady = (data && !loading && !error)
    const allEntries = preview
        ? dataReady
            ? data
            : []
        : raflData

    const refreshPreview = useCallback(async () => {
        const url = 'http://explore.lpubelts.com:8080/refresh-preview'
        const response = await fetch(url, {cache: 'no-store'})
        console.log(await response.json())
        await refresh()
    },[refresh])

    const extras = (
        <React.Fragment>
            <SearchBox label='Raffle Pots'/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <PreviewButton/>
        </React.Fragment>
    )
    const extrasTwo = (
        <React.Fragment>
            <ViewFilterButtons sortValues={raffleSortFields}/>
        </React.Fragment>
    )

    return (
        <FilterProvider filterFields={raffleFilterFields}>
            <RaffleDataProvider allEntries={allEntries} profile={lockCollection}>

                <Nav title='RAFL' extras={extras} extrasTwo={extrasTwo}/>

                {preview &&
                    <div style={{
                        maxWidth: 700,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 20,
                        padding: 2,
                        fontWeight:700,
                        fontSize:'1.2rem',
                        backgroundColor: '#900',
                        display:'flex',
                        alignItems:'center'
                    }}>
                        <div style={{flexGrow:1, marginLeft:20}}>PREVIEW MODE</div>
                        <IconButton onClick={refreshPreview} style={{marginRight:10}}>
                            <CachedIcon/>
                        </IconButton>
                    </div>
                }

                {preview && !dataReady
                    ? <LoadingDisplay/>
                    : <RafflePage profile={lockCollection}/>
                }

                <Footer/>

                <Tracker feature='rafl'/>
            </RaffleDataProvider>
        </FilterProvider>
    )
}

export default RaffleRoute
