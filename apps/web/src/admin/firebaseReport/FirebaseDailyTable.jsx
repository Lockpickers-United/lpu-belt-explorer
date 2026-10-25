import React, {useCallback, useState} from 'react'
import useWindowSize from '../../util/useWindowSize'
import AdminStatsTableSort from '../../admin/AdminStatsTableSort.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import dayjs from 'dayjs'

const FirebaseDailyTable = ({data}) => {
    const navigate = useNavigate()
    const {dailyTotals, requestSubscriptions} = data

    const columns = [
        {name: 'Date', align: 'left', id: 'date'},
        {name: 'Total Reads', align: 'left', id: 'reads'},
        {name: 'Writes', align: 'left', id: 'writes'},
        {name: '', align: 'left', id: 'spacer'},
        {name: 'Subscription Reads', align: 'left', id: 'subscriptionReads'},
        {name: 'Subscription Refresh Reads', align: 'left', id: 'subscriptionRefreshes'}
    ]

    const sortable = true
    const [sort, setSort] = useState('date')
    const [ascending, setAscending] = useState(true)

    const mappedData = Object.keys(dailyTotals).map(key => {
        const date = dayjs(key) || 0
        const reads = dailyTotals[key]['READ'] || 0
        const writes = dailyTotals[key]['WRITE'] || 0
        const subscriptionReads = requestSubscriptions[key]?.READ || 0
        const subscriptionRefreshes = requestSubscriptions[key]?.REFRESH || 0

        return {
            date: date.format('MM/DD/YYYY'),
            reads,
            writes,
            spacer: '|',
            subscriptionReads,
            subscriptionRefreshes
        }
    })
        .filter(x => x)
        .sort((a, b) => {
            switch (sort) {
                case 'reads':
                    return a['reads'] - b['reads']
                default:
                    return parseInt(b[sort]) - parseInt(a[sort])
            }
        })

    const rows = ascending ? mappedData : mappedData.reverse()
    const tableData = {columns: columns, data: rows}

    const linkFunction = useCallback((id, string) => {
        return id === 'title'
            ? <Link onClick={() => navigate(`/foobar/${string}`)}
                    style={{color: '#fff'}}>{string}</Link>
            : string
    }, [navigate])

    const {isMobile} = useWindowSize()
    const fontSize = isMobile
        ? '.8rem'
        : '.95rem'

    const tableWidth = '100%'

    return (
        <div>
            <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                                 sortable={sortable} sort={sort} setSort={setSort}
                                 ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>
        </div>

    )
}

export default FirebaseDailyTable
