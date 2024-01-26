import React from 'react'
import AdminStatsTable from './AdminStatsTable.jsx'
import dayjs from 'dayjs'

const CollectionsLast28Table = ({fullData}) => {

    const data = fullData.dailyTableData
    let dates = []
    data.data.map((dayData) => {
        dates.push(dayData['date'])
    })
    const latest = dayjs(dates.reduce((max, c) => c > max ? c : max))
    const startDay = latest.subtract(28, 'day')

   const last28data = []
    data.data.map((dayData) => {
        if (dayjs(dayData['date']).isAfter(startDay)) {
            last28data.push(dayData)
        }
    })
    const last28 = new Map()
    last28['title'] = ''
    last28['columns'] = data['columns']
    last28['data'] = last28data

    const tableWidth = '100%'
    const fontSize = '.83rem'

    return (
        <div style={{width:'100%'}}>
                <AdminStatsTable tableData={last28} tableWidth={tableWidth} fontSize={fontSize}/>
        </div>
    )
}

export default CollectionsLast28Table
