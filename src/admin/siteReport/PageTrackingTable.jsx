import React from 'react'
import AdminStatsTable from '../AdminStatsTable'
import useWindowSize from '../../util/useWindowSize'

const PageTrackingTable = ({data}) => {
    const {pageTracking} = data

    const totals = Object.keys(pageTracking.data[13]).sort((a, b) => {
        return pageTracking.data[13][b] - pageTracking.data[13][a]
    }).filter(page => page !== 'total' && page !== 'date')
    totals.unshift('date')
    totals.push('total')

    const columns = totals.reduce((acc,page) => {
        const col = pageTracking.columns.find(c => c.id === page)
        acc.push(col)
        return acc
    },[])
    const orderedPages = {columns: columns, data: pageTracking.data}

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
        <AdminStatsTable tableData={orderedPages} tableWidth={tableWidth} fontSize={fontSize}/>
    )
}

export default PageTrackingTable
