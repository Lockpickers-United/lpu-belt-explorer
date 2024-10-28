import React, {useCallback, useState} from 'react'
import AdminStatsTableSort from '../AdminStatsTableSort'
import useWindowSize from '../../util/useWindowSize'
import awards from '../../data/awards.json'
import dayjs from 'dayjs'
import {beltSort} from '../../data/belts'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'

const ImportUsersTable = ({data}) => {
    const {awardsDisplayNames} = data
    const navigate = useNavigate()

    const sortable = true
    const [sort, setSort] = useState('acquired')
    const [ascending, setAscending] = useState(true)

    const rowData = Object.keys(awardsDisplayNames).filter(x => x)
        .map(user => {
            return {
                displayName: awardsDisplayNames[user]['displayName'],
                acquired: awardsDisplayNames[user]['acquired'],
                maxAward: awards[awardsDisplayNames[user]['maxAward']].makeModels[0].model.replace(' Belt', ''),
                beltName: awards[awardsDisplayNames[user]['maxAward']].name.replace(' Belt', ''),
                userId: user
            }
        })
        .sort((a, b) => {
            switch (sort) {
                case 'acquired':
                    return dayjs(a[sort]).valueOf() - dayjs(b[sort]).valueOf()
                        || a['displayName'].localeCompare(b['displayName'])
                case 'maxAward':
                    return beltSort(a.beltName, b.beltName)
                case 'displayName':
                    return a[sort].localeCompare(b[sort])
                default:
                    return a['displayName'].localeCompare(b['displayName'])
            }
        })
    const sortedRows = ascending ? rowData : rowData.reverse()
    const rows = sortedRows.map((user, index) => {
        return {...user, index: index + 1}
    })

    const linkFunction = useCallback((id, string) => {
        const user = rows.find(row => row.displayName === string)
        return id === 'displayName'
            ? <Link onClick={() => navigate(`/profile/${user.userId}/scorecard`)} style={{color:'#fff'}}>{string}</Link>
            : string
    },[navigate, rows])



    console.log('rows', rows)

    const tableData = {
        columns: [
            {'name': '#', 'align': 'center', 'id': 'index'},
            {'name': 'Display Name', 'align': 'left', 'id': 'displayName'},
            {'name': 'Belt/Dan', 'align': 'center', 'id': 'maxAward'},
            {'name': 'Acquisition Date', 'align': 'center', 'id': 'acquired'}
        ],
        data: rows
    }

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560
    const midWindow = width <= 820

    const fontSize = mobileSmall ? '.8rem'
        : mobileMedium ? '.85rem'
            : mobileLarge ? '.9rem'
                : smallWindow ? '.9rem'
                    : midWindow ? '.9rem'
                        : '.9rem'

    const tableWidth = '80%'

    return (
        <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                             sortable={sortable} sort={sort} setSort={setSort}
                             ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>
    )
}

export default ImportUsersTable
