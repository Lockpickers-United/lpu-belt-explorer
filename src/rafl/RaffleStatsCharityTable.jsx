import React, {useCallback, useContext, useState} from 'react'
import useWindowSize from '../util/useWindowSize'
import AdminStatsTableSort from '../admin/AdminStatsTableSort.jsx'
import RaffleContext from './RaffleContext.jsx'

const RaffleStatsCharityTable = ({summary, tableWidth, nameLength}) => {
    const {allCharities} = useContext(RaffleContext)

    const columns = [
        {id: 'displayName', align: 'left', name: 'Charity Name'},
        {id: 'donors', name: 'Donors', align: 'center'},
        {id: 'donations', name: 'Raised', align: 'center', prefix: '$'}
    ]

    const sortable = true
    const [sort, setSort] = useState('name')
    const [ascending, setAscending] = useState(true)

    const mappedRows = allCharities.map(row => {
        let charityName = row?.name ? row?.name.substring(0, nameLength) : 'unknown'
        charityName = row?.name?.length < nameLength ? charityName : charityName + '...'

        return summary.charities[row.id] && summary.charities[row.id].totalDonations > 0
            ? {
                ...row,
                donations: summary.charities[row.id].totalDonations,
                donationsText: `$${summary.charities[row.id].totalDonations}`,
                donors: summary.charities[row.id].uniqueDonors.length,
                displayName: charityName
            }
            : {...row, displayName: charityName}
    })

    const charityData = mappedRows
        .sort((a, b) => {
            switch (sort) {
                case 'name':
                    return a['name'].localeCompare(b['name'])
                case 'donors':
                    return (b.donors || 0) - (a.donors || 0)
                        || a['name'].localeCompare(b['name'])
                case 'donations':
                    return (b.donations || 0) - (a.donations || 0)
                        || a['name'].localeCompare(b['name'])
                default:
                    return a['name'].localeCompare(b['name'])
            }
        })

    const sortedCharities = ascending ? charityData : charityData.reverse()

    const charitiesWithDonations = sortedCharities.filter(x => x.donors && x.donors > 0)
    const charitiesWithoutDonations = sortedCharities
        .filter(x => !x.donors || x.donors === 0)
        .sort((a, b) => {return a['name'].localeCompare(b['name'])})
    const finalCharityList = [...charitiesWithDonations, ...charitiesWithoutDonations]

    const tableData = {columns: columns, data: finalCharityList}

    const linkFunction = useCallback((id, string) => {
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
            <div style={{justifyItems: 'center', marginBottom: 20, width: 400}}>
            </div>

            <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                                 sortable={sortable} sort={sort} setSort={setSort}
                                 ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>
        </div>

    )
}

export default RaffleStatsCharityTable
