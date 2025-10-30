import React, {useCallback} from 'react'
import AdminStatsTableSort from '../AdminStatsTableSort'
import useWindowSize from '../../util/useWindowSize'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'

const SearchTermsTable = ({data}) => {
    const navigate = useNavigate()

    const {searchTerms} = data
    const tableData = {
        columns: [
            {'name': '#', 'align': 'center', 'id': 'number'},
            ...searchTerms.columns
        ],
        data: searchTerms.data
            .sort((a, b) => b.lockViews - a.lockViews || a.term.localeCompare(b.term))
            .slice(0, 100)
            .map((item, index) => {
            return {
                number: index + 1,
                term: item.term,
                lockViews: item.lockViews,
            }
        })
    }

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

    const tableWidth = 375
    const tableHeight = 650

    return (
        <div>
            <AdminStatsTableSort tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}
                                 sortable={false} tableHeight={tableHeight} sort={'number'} linkFunction={linkFunction}/>



        </div>
    )
}

export default SearchTermsTable
