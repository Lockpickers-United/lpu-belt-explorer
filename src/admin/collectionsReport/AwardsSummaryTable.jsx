import React, {useContext, useMemo} from 'react'
import AdminStatsTable from '../AdminStatsTable'
import dayjs from 'dayjs'
import ReportsContext from '../ReportsContext.jsx'

const AwardsSummaryTable = () => {
    const {data} = useContext(ReportsContext)
    const {collectionStatsDaily} = data

    const last28 = useMemo(() => {
        const dates = collectionStatsDaily.map(value => value.date)
        const latest = dayjs(dates.reduce((max, c) => c > max ? c : max))
        const earliest = dayjs('2024-10-25')
        const startDay = latest.subtract(14, 'day') > earliest ? latest.subtract(14, 'day') : earliest

        return {
            title: '',
            columns: columns,
            data: collectionStatsDaily.filter((dayData) => {
                return dayjs(dayData.date).isAfter(startDay)
            })
        }
    }, [collectionStatsDaily])

    const tableWidth = '100%'
    const fontSize = '.83rem'

    return (
        <div style={{width: '100%'}}>
            <AdminStatsTable tableData={last28} tableWidth={tableWidth} fontSize={fontSize}/>
        </div>
    )
}

const columns = [
    {
        'align' : 'left',
        'name' : 'Date',
        'id' : 'date'
    },
    {
        'id' : 'totalProfiles',
        'name' : 'Total Users',
        'align' : 'center'
    },
    {
        'id' : 'importUsers',
        'name' : 'Import Users',
        'align' : 'center'
    },
    {
        'id' : 'newImportUsers',
        'align' : 'center',
        'name' : 'New Import Users'
    },
    {
        'id' : 'awardUsers',
        'name' : 'Award Users',
        'align' : 'center'
    },
    {
        'name': 'Total Awards',
        'align': 'center',
        'id': 'totalAwards'
    }
]



export default AwardsSummaryTable
