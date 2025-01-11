import React, {useContext} from 'react'
import AdminStatsTable from '../AdminStatsTable'
import useWindowSize from '../../util/useWindowSize'
import ReportsContext from '../ReportsContext.jsx'

const CollectionsSummaryTable = () => {

    const {collectionSummary} = useContext(ReportsContext)

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
        <React.Fragment>
            <AdminStatsTable tableData={collectionSummary} tableWidth={tableWidth} fontSize={fontSize}/>
        </React.Fragment>
    )
}

export default CollectionsSummaryTable
