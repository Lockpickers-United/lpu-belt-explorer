import React, {useMemo} from 'react'
import AdminStatsTable from './AdminStatsTable'
import dayjs from 'dayjs'

function CollectionsLast28Table({data}) {
    const last28 = useMemo(() => {
        const {dailyTableData} = data
        const dates = dailyTableData.data.map(value => value.date)
        const latest = dayjs(dates.reduce((max, c) => c > max ? c : max))
        const startDay = latest.subtract(28, 'day')
        return {
            title: '',
            columns: dailyTableData.columns,
            data: dailyTableData.data.filter((dayData) => {
                return dayjs(dayData.date).isAfter(startDay)
            })
        }
    }, [data])

    const tableWidth = '100%'
    const fontSize = '.83rem'

    return (
        <div style={{width: '100%'}}>
            <AdminStatsTable tableData={last28} tableWidth={tableWidth} fontSize={fontSize}/>
        </div>
    )
}

export default CollectionsLast28Table
