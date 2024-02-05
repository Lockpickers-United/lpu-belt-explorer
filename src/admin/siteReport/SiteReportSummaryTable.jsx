import React from 'react'
import AdminStatsTable from '../AdminStatsTable'
import useWindowSize from '../../util/useWindowSize'
import dayjs from 'dayjs'

const SiteReportSummaryTable = ({fullData}) => {

    const data = fullData.traffic28days

    const daysToReport = 28

    function lastN(row) {
        return dayjs().subtract(daysToReport + 1, 'day').isBefore(dayjs(row.date))
    }

    const tabledata = {
        columns: data.columns
            .filter(column => column.id !== 'weekend')
            .filter(column => column.id !== 'visitors'),
        data: data.data.filter(lastN)
    }

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

    const tableWidth = 170
    const tableHeight = 340

    return (
            <AdminStatsTable
                tableData={tabledata}
                tableWidth={tableWidth}
                tableHeight={tableHeight}
                fontSize={fontSize}
            />
    )
}

export default SiteReportSummaryTable
