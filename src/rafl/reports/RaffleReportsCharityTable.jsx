import React, {useCallback, useContext} from 'react'
import useWindowSize from '../../util/useWindowSize'
import RaffleContext from '../RaffleContext.jsx'
import DataTableSort from '../../misc/DataTableSort.jsx'

const RaffleReportsCharityTable = () => {
    const {allCharities} = useContext(RaffleContext)
    const {isMobile} = useWindowSize()
    const nameLength = !isMobile ? 48 : 24

    const rows = allCharities.map(charity => {
        let charityName = charity?.name ? charity?.name.substring(0, nameLength) : 'unknown'
        charityName = charity?.name?.length < nameLength ? charityName : charityName + '...'
        return {
            ...charity,
            displayName: charityName,
        }
    })
    const columns = [
        {id: 'displayName', align: 'left', name: 'Charity Name'},
        {id: 'donations2024', name: '2024', align: 'left', displayField: 'donations2024text', descending: true},
        {id: 'donations2025', name: '2025', align: 'center', displayField: 'donations2025text', descending: true},
        {id: 'donations', name: 'Raised', align: 'right', displayField: 'donationsText', descending: true},
        {id: 'donors', name: 'Donors', align: 'center', descending: true},
    ]
    const defaultSort = 'displayName'
    const tableData = {columns, rows, defaultSort, sortable: true}

    const tableWidth = '100%'
    const linkFunction = useCallback((_id, string) => {
        return string
    }, [])

    return (
        <div style={{marginTop: 20, width: tableWidth}}>
            <DataTableSort tableData={tableData} tableWidth={tableWidth} linkFunction={linkFunction}/>
        </div>
    )
}

export default RaffleReportsCharityTable
