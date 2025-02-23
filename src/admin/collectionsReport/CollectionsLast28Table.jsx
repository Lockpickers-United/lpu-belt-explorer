import React, {useContext, useMemo} from 'react'
import AdminStatsTable from '../AdminStatsTable'
import dayjs from 'dayjs'
import ReportsContext from '../ReportsContext.jsx'

function CollectionsLast28Table({cohort}) {

    const {data} = useContext(ReportsContext)
    const {collectionStatsDaily} = data

    const last28 = useMemo(() => {
        const dates = collectionStatsDaily.dayData.map(dayData => dayData.date)
        const latest = dayjs(dates.reduce((max, c) => c > max ? c : max))
        const startDay = latest.subtract(14, 'day')

        const tableColumns = [
            {name: 'Date', id: 'date', align: 'left'},
            {align: 'center', id: 'totalUsers', name: 'Total Users'},
            {name: 'List Users', id: 'listUsers', align: 'center'},
            {align: 'center', id: 'totalSaves', name: 'Total Saves'},
            {name: 'Owned Users', id: 'ownUsers', align: 'center'},
            {name: 'Picked Users', id: 'pickedUsers', align: 'center'},
            {id: 'scorecardUsers', align: 'center', name: 'Scorecard Users'},
            {id: 'wishlistUsers', align: 'center', name: 'Wishlist Users'},
            {id: 'newUsers', align: 'center', name: 'New Users'}
        ]

        const tableData = collectionStatsDaily.dayData.map(dayData => {
            return {
                date: dayData[cohort].date,
                totalUsers: dayData[cohort].totalProfiles,
                listUsers: dayData[cohort].listUsers,
                totalSaves: dayData[cohort].totalSaves,
                ownUsers: dayData[cohort].listStats.find(list => list.listName === 'own')?.userCount,
                pickedUsers: dayData[cohort].listStats.find(list => list.listName === 'picked')?.userCount,
                scorecardUsers: dayData[cohort].listStats.find(list => list.listName === 'recordedLocks')?.userCount,
                wishlistUsers: dayData[cohort].listStats.find(list => list.listName === 'wishlist')?.userCount,
                newUsers: dayData[cohort].newListUsers
            }

        })


        return {
            title: '',
            columns: tableColumns,
            data: tableData.filter((dayData) => {
                return dayjs(dayData.date).isAfter(startDay)
            })
        }
    }, [cohort, collectionStatsDaily])

    const tableWidth = '100%'
    const fontSize = '.83rem'

    return (
        <div style={{width: '100%'}}>
            <AdminStatsTable tableData={last28} tableWidth={tableWidth} fontSize={fontSize}/>
        </div>
    )
}

export default CollectionsLast28Table
