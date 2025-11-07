import React, {useCallback, useContext} from 'react'
import RaffleContext from './RaffleContext.jsx'
import DataTableSort from '../misc/DataTableSort.jsx'

const RaffleStatsCharityTable = ({data, columns, tableWidth, nameLength}) => {
    const {allCharities} = useContext(RaffleContext)
    data = allCharities

    columns = [
        {id: 'displayName', align: 'left', name: 'Charity Name'},
        {id: 'donors', name: 'Donors', align: 'center', descending: true},
        {id: 'donations', name: 'Raised', align: 'center', displayField: 'donationsText', descending: true}
    ]
    const rows = data.map(row => {
        let charityName = row?.name ? row?.name.substring(0, nameLength) : 'unknown'
        charityName = row?.name?.length < nameLength ? charityName : charityName + '...'
        return {
            ...row,
            displayName: charityName,
        }
    })
    const defaultSort = 'displayName'
    const tableData = {columns, rows, defaultSort, sortable: true}

    const linkFunction = useCallback((_id, string) => {
        return string
    }, [])

    return (
        <div>
            <div style={{justifyItems: 'center', marginBottom: 20, width: 400}}>
            </div>
            <DataTableSort tableData={tableData} tableWidth={tableWidth} linkFunction={linkFunction}/>
        </div>
    )
}

export default RaffleStatsCharityTable
