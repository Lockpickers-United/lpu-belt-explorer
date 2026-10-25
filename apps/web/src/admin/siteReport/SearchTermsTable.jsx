import React, {useCallback, useState} from 'react'
import AdminStatsTableSort from '../AdminStatsTableSort'
import useWindowSize from '../../util/useWindowSize'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'

const SearchTermsTable = ({data}) => {
    const navigate = useNavigate()

    const {searchTerms} = data

    const sortable = true
    const [sort, setSort] = useState('completedSearches')
    const [ascending, setAscending] = useState(true)

    const columns = [
        {'name': '#', 'align': 'center', 'id': 'index'},
        ...searchTerms.columns,
        {'id': 'viewsPerSearch', 'name': 'Views/Search', 'align': 'center'}
    ]

    const viewsPerSearch = searchTerms.data.reduce((acc, item) => {
        acc = acc || {}
        const vps = item.completedSearches > 0
            ? item.lockViews / item.completedSearches
            : 0
        acc[item.term] = Math.round(vps)
        return acc
    }, {})

    const mappedData = searchTerms.data.map(item => {
        return {
            ...item,
            viewsPerSearch: viewsPerSearch[item.term]
        }
    })

    const rows = mappedData.sort((a, b) => {
        switch (sort) {
            case 'lockViews':
                return (b.lockViews || 0) - (a.lockViews || 0) || a.term.localeCompare(b.term)
            case 'completedSearches':
                return (b.completedSearches || 0) - (a.completedSearches || 0) || a.term.localeCompare(b.term)
            case 'viewsPerSearch':
                return (b.viewsPerSearch || 0) - (a.viewsPerSearch || 0) || a.term.localeCompare(b.term)
            default:
                return (b.lockViews || 0) - (a.lockViews || 0) || a.term.localeCompare(b.term)
        }
    })
        .slice(0, 300)
        .map((item, index) => {
            return {
                index: index + 1,
                ...item
            }
        })

    const sortedRows = ascending ? rows : rows.reverse()
    const tableData = {columns: columns, data: sortedRows}

    const linkFunction = useCallback((id, string) => {
        return id === 'term'
            ? <Link onClick={() => navigate(`/locks?tab=search&search=${string}`)}
                    style={{color: '#fff'}}>{string}</Link>
            : string
    }, [navigate])

    const {width} = useWindowSize()
    const mobile360 = width <= 360
    const mobile395 = width <= 395
    const mobile428 = width <= 428  // but test also at 412
    const window560 = width <= 560
    const window820 = width <= 820

    const fontSize = mobile360 ? '.8rem'
        : mobile395 ? '.85rem'
            : mobile428 ? '.9rem'
                : window560 ? '.9rem'
                    : window820 ? '.9rem'
                        : '.85rem'

    const tableWidth = 550
    const tableHeight = 750

    return (
        <div>
            <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                                 sortable={sortable} tableHeight={tableHeight} sort={sort} setSort={setSort}
                                 ascending={ascending} setAscending={setAscending} linkFunction={linkFunction}/>


        </div>
    )
}

export default SearchTermsTable
