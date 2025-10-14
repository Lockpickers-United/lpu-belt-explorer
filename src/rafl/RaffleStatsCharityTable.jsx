import React, {useCallback, useContext, useState} from 'react'
import useWindowSize from '../util/useWindowSize'
import AdminStatsTableSort from '../admin/AdminStatsTableSort.jsx'
import RaffleContext from './RaffleContext.jsx'

const RaffleStatsCharityTable = ({tableWidth, nameLength}) => {
    const {allCharities} = useContext(RaffleContext)

    const columns = [
        {id: 'displayName', align: 'left', name: 'Charity Name'},
        {id: 'donors', name: 'Donors', align: 'center'},
        {id: 'donations', name: 'Raised', align: 'center'}
    ]

    const sortable = true
    const [sort, setSort] = useState('name')
    const [ascending, setAscending] = useState(true)

    const charityData = allCharities
        .sort((a, b) => {
            switch (sort) {
                case 'name':
                    return a['name'].localeCompare(b['name'])
                case 'donors':
                    return b[sort] - (a[sort])
                case 'donations':
                    return b[sort] - (a[sort])
                default:
                    return a['name'].localeCompare(b['name'])
            }
        })

    const sortedPots = ascending ? charityData : charityData.reverse()

    const mappedRows = sortedPots.map(row => {
        let charityName = row?.name ? row?.name.substring(0, nameLength) : 'unknown'
        charityName = row?.name?.length < nameLength ? charityName : charityName + '...'

        return row.donations && row.donations > 0
        ? {...row, donations: `$${row.donations}`, displayName: charityName}
        : {...row, displayName: charityName}
    })
    const tableData = {columns: columns, data: mappedRows}

    const linkFunction = useCallback((_id, string) => {
        return string
    }, [])

    const {width} = useWindowSize()
    const mobile360 = width <= 360
    const mobile395 = width <= 395
    const mobile428 = width <= 428  // but test also at 412
    const window560 = width <= 560
    const window820 = width <= 820

    const fontSize = mobile360 ? '.8rem'
        : mobile395 ? '.85rem'
            : mobile428 ? '.9rem'
                : window560 ? '.95rem'
                    : window820 ? '.95rem'
                        : '.95rem'


    return (
        <div>

            <div style={{justifyItems: 'center', marginBottom: 20}}>
                <div style={{width:400}}>
                </div>
            </div>

            <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                                 sortable={sortable} sort={sort} setSort={setSort}
                                 ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>
        </div>

    )
}

export default RaffleStatsCharityTable
