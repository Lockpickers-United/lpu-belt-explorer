import React, {useCallback, useContext, useState} from 'react'
import useWindowSize from '../../util/useWindowSize'
import RaffleContext from '../RaffleContext.jsx'
import AdminStatsTableSort from '../../admin/AdminStatsTableSort.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'

const RafflePotTable = ({data}) => {
    const navigate = useNavigate()

    const {potViewsById} = data
    const {potStats} = useContext(RaffleContext)


    const columns = [
        {name: 'Pot ID', align: 'left', id: 'id'},
        {id: 'title', align: 'left', name: 'Pot Title'},
        {id: 'views', align: 'center', name: 'Pot Views'},
        {id: 'percentViews', name: '% Views', align: 'center'},
        {id: 'donors', name: 'Donors', align: 'center'},
        {id: 'tickets', name: 'Tickets', align: 'center'}
    ]

    const sortable = true
    const [sort, setSort] = useState('id')
    const [ascending, setAscending] = useState(true)

    const potData = potViewsById.data.map(pot => {
        const statsPot = potStats.find(p => p.id === pot.id)
        return {...pot, ...statsPot, percentViews: (Math.floor(pot.percentViews * 100) + '%')}
    })
        .sort((a, b) => {
            switch (sort) {
                case 'id':
                    return a[sort].localeCompare(b[sort])
                case 'title':
                    return a[sort].localeCompare(b[sort])
                default:
                    return b[sort] - a[sort]
                    || a['id'].localeCompare(b['id'])
            }
        })

    const sortedRows = ascending ? potData : potData.reverse()

    const tableData = {columns: columns, data: sortedRows}

    const linkFunction = useCallback((id, string) => {
        const pot = potData.find(row => row.title === string)
        const safeName = pot?.title.replace(/[\s/]/g, '_').replace(/\W/g, '')
        return id === 'title'
            ? <Link onClick={() => navigate(`/rafl/?id=${pot.id}&name=${safeName}`)} style={{color:'#fff'}}>{string}</Link>
            : string
    },[navigate, potData])

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

    const tableWidth = '100%'

    return (
        <React.Fragment>
            <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                                 sortable={sortable} sort={sort} setSort={setSort}
                                 ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>
        </React.Fragment>

    )
}

export default RafflePotTable
