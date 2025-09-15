import React, {useCallback, useContext} from 'react'
import DataContext from '../context/DataContext.jsx'
import NoEntriesCard from '../locks/NoEntriesCard.jsx'
import Link from '@mui/material/Link'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleSearchBar from './RaffleSearchBar.jsx'
import RaffleContext from './RaffleContext.jsx'
import RaffleHiddenDialog from './RaffleHiddenDialog.jsx'
import DataTableSort from '../misc/DataTableSort.jsx'

function RaffleCharitesPage() {
    const {visibleEntries} = useContext(DataContext)
    const {raflState} = useContext(RaffleContext)

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    const {isMobile} = useWindowSize()
    const currTextDesc = raflState === 'live' ? 'So Far' : 'Donations'
    const prevText = !isMobile ? '2025 Contributions' : '2025'
    const currText = !isMobile ? `2026 ${currTextDesc}` : '2026'

    const shortName = useCallback((charity) => {
        const nameLength = !isMobile ? 99 : 99
        let charityName = charity?.name ? charity?.name.substring(0, nameLength) : 'unknown'
        return charity?.name?.length < nameLength ? charityName : charityName + '...'
    },[isMobile])

    const rows = visibleEntries.map(charity => {
        return {
            ...charity,
            displayName: shortName(charity),
        }
    })
    const columns = [
        {id: 'displayName', align: 'left', name: 'Charity Name'},
        {id: 'donations2025', name: prevText, align: 'center', displayField: 'donations2025text', descending: true},
        {id: 'donations', name: currText, align: 'center', displayField: 'donationsText', descending: true}
    ]
    const defaultSort = 'displayName'
    const tableWidth = '100%'
    const tableData = {columns, rows, defaultSort, sortable: true, wrap: true}

    const linkFunction = useCallback((id, string) => {
        const charity = visibleEntries.find(c => {
            return shortName(c) === string
        })
        if (!charity) return string
        const url = charity.url || `https://www.google.com/search?q=${encodeURIComponent(charity.name)}`
        return id === 'displayName'
            ? <Link onClick={() => openInNewTab(url)}
                    style={{color: '#fff', fontWeight: 700}}>{string}</Link>
            : string
    }, [openInNewTab, shortName, visibleEntries])

    return (
        <React.Fragment>
            <div style={{paddingBottom: 32, width: tableWidth}}>
                <RaffleSearchBar label='All Approved Charities' sortValues={null}/>
                {visibleEntries.length === 0
                    ? <NoEntriesCard label='Charities'/>
                    : <DataTableSort tableData={tableData} tableWidth={tableWidth} linkFunction={linkFunction}/>
                }
            </div>
            <RaffleHiddenDialog/>
        </React.Fragment>
    )
}

export default RaffleCharitesPage
