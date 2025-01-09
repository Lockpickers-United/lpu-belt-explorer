import React from 'react'
import AdminStatsTable from '../../admin/AdminStatsTable'
import useWindowSize from '../../util/useWindowSize'
import dayjs from 'dayjs'

const RafflePageTrackingTable = ({data}) => {

    const {rafl28days} = data


    const chartData = rafl28days.data.filter(dayData => {
        return dayjs(dayData.date) > dayjs('2024-12-28')
    })

    const pageTotals = chartData.reduce((acc, dayData) => {
        Object.keys(rafl28days.data[rafl28days.data.length - 1]).map(key => {
            if (!['date', 'dateString'].includes(key)) {
                acc[key] = acc[key] ? acc[key] + dayData[key] : dayData[key]
            }
        })
        return acc
    },{})
    pageTotals.dateString = 'Total'
    chartData.push(pageTotals)

    const pageAverages = Object.keys(pageTotals).reduce((acc, key) => {
        acc[key] = Math.floor(pageTotals[key] / chartData.length)
        return acc
    },{})
    pageAverages.dateString = 'Average'
    chartData.push(pageAverages)

    const tableData = {columns: rafl28days.columns, data: chartData}

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
        <AdminStatsTable tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}/>
    )
}

export default RafflePageTrackingTable
