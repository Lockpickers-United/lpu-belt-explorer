import React, {useCallback, useState} from 'react'
import useWindowSize from '../../util/useWindowSize'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import dayjs from 'dayjs'
import AdminStatsTable from '../AdminStatsTable.jsx'

const FirebaseDailyTable = ({data}) => {
    const navigate = useNavigate()
    const {bySource} = data

    const columns = [
        {name: 'Date', align: 'left', id: 'date'},
        {name: 'Export Collections', align: 'left', id: 'collectionsExport_lockcollections'},
        {name: 'Export Evidence', align: 'left', id: 'awardsEvidenceExport_evidence'},
        {name: 'Export Awards', align: 'left', id: 'awardsEvidenceExport_awards'},
        {name: 'Requests Subscriptions', align: 'left', id: 'request_subscription'},
        {name: 'Request Votes', align: 'left', id: 'request_upvote'},
        {name: 'Request Updates', align: 'left', id: 'request_update'}
    ]
    
    const sortable = true
    const [sort, setSort] = useState('date')
    const [ascending, setAscending] = useState(true)

    const mappedData = Object.keys(bySource).map(key => {
        const date = dayjs(key)
        const collectionsExport_lockcollections = bySource[key].collectionsExport_lockcollections
        const awardsEvidenceExport_evidence = bySource[key].awardsEvidenceExport_evidence
        const awardsEvidenceExport_awards = bySource[key]?.awardsEvidenceExport_awards || 0
        const request_subscription = bySource[key]['request-subscription'] || 0
        const request_upvote = bySource[key]['request-upvote'] || 0
        const request_update = bySource[key]['request-update'] || 0

        return {
            date: date.format('MM/DD/YYYY'),
            collectionsExport_lockcollections,
            awardsEvidenceExport_evidence,
            awardsEvidenceExport_awards,
            request_subscription,
            request_upvote,
            request_update
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
            <AdminStatsTable tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                             sortable={sortable} sort={sort} setSort={setSort}
                             ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>
        </div>

    )
}

export default FirebaseDailyTable
