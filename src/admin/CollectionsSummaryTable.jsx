import React from 'react'
import AdminStatsTable from './AdminStatsTable'
import useWindowSize from '../util/useWindowSize'

const CollectionsSummaryTable = ({data}) => {
    const {summary} = data

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560
    const midWindow = width <= 820

    const fontSize = mobileSmall ? '.8rem'
        : mobileMedium ? '.85rem'
            : mobileLarge ? '.9rem'
                : smallWindow ? '.95rem'
                    : midWindow ? '.95rem'
                        : '.95rem'

    const tableWidth = '100%'

    return (
        <AdminStatsTable tableData={summary} tableWidth={tableWidth} fontSize={fontSize}/>
    )
}

export default CollectionsSummaryTable
