import React, {useCallback, useContext, useState} from 'react'
import useWindowSize from '../util/useWindowSize'
import AdminStatsTableSort from '../admin/AdminStatsTableSort.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import DataContext from '../context/DataContext.jsx'

const RafflePotTable = ({summary, tableWidth, nameLength}) => {
    const navigate = useNavigate()
    const {getPotFromId} = useContext(DataContext)

    const columns = [
        {id: 'title', align: 'left', name: 'Title'},
        {id: 'uniqueDonorCount', name: 'Donors', align: 'center'},
        {id: 'totalTickets', name: 'Tickets', align: 'center'}
    ]

    const sortable = true
    const [sort, setSort] = useState('title')
    const [ascending, setAscending] = useState(true)

    const potData = Object.keys(summary.pots).map(potId => {
        const dataPot = getPotFromId(potId)
        if (!dataPot) return null

        let potTitle = dataPot?.title ? dataPot.title.substring(0, nameLength) : `unknown (${potId})`
        potTitle = dataPot?.title?.length < nameLength || !dataPot?.title ? potTitle : potTitle + '...'

        return {
            ...summary.pots[potId],
            ...dataPot,
            title: potTitle,
            uniqueDonorCount: summary.pots[potId]?.uniqueDonors?.length || 0,
        }
    })
        .filter(x => x)
        .sort((a, b) => {
            switch (sort) {
                case 'title':
                    return a[sort].localeCompare(b[sort])
                case 'donors':
                    return parseInt(b[sort]) - parseInt(a[sort])
                        || a['title'].localeCompare(b['title'])
                case 'tickets':
                    return parseInt(b[sort]) - parseInt(a[sort])
                        || a['title'].localeCompare(b['title'])
                default:
                    return parseInt(b[sort]) - parseInt(a[sort])
                        || a['title'].localeCompare(b['title'])
            }
        })

    console.log('potData', potData)

    const rows = ascending ? potData : potData.reverse() || []

    const mappedRows = rows.map(row => {
        return row.donors && row.donors > 0
            ? {...row}
            : {...row, donors: 0, tickets: 0}
    })

    const tableData = {columns: columns, data: mappedRows}

    const linkFunction = useCallback((id, string) => {
        const pot = potData.find(row => row.title === string)
        const safeName = pot?.title.replace(/[\s/]/g, '_').replace(/\W/g, '')
        return id === 'title'
            ? <Link onClick={() => navigate(`/rafl/?id=${pot.id}&name=${safeName}`)}
                    style={{color: '#fff'}}>{string}</Link>
            : string
    }, [navigate, potData])

    const {width} = useWindowSize()
    const mobile360 = width <= 360
    const mobile395 = width <= 395
    const mobile428 = width <= 428  // but test also at 412
    const window560 = width <= 560
    const window820 = width <= 820

    const fontSize = mobile360 ? '.8rem'
        : mobile395 ? '.8rem'
            : mobile428 ? '.9rem'
                : window560 ? '.95rem'
                    : window820 ? '.95rem'
                        : '.95rem'

    return (
            <div>
                <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                                     sortable={sortable} sort={sort} setSort={setSort}
                                     ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>
            </div>
    )
}

export default RafflePotTable
