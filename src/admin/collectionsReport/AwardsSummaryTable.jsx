import React, {useMemo} from 'react'
import AdminStatsTable from '../AdminStatsTable'
import dayjs from 'dayjs'

const AwardsSummaryTable = ({data}) => {

    const last28 = useMemo(() => {
        const {dailyAwardsTableData} = data
        const dates = dailyAwardsTableData.data.map(value => value.date)
        const latest = dayjs(dates.reduce((max, c) => c > max ? c : max))
        const earliest = dayjs('2024-10-25')
        const startDay = latest.subtract(14, 'day') > earliest ? latest.subtract(14, 'day') : earliest
        return {
            title: '',
            columns: dailyAwardsTableData.columns,
            data: dailyAwardsTableData.data.filter((dayData) => {
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

export default AwardsSummaryTable
