import React, {useContext, useMemo} from 'react'
import AdminStatsTable from '../AdminStatsTable'
import dayjs from 'dayjs'
import ReportsContext from '../ReportsContext.jsx'

function CollectionsLast28Table() {

    const {data} = useContext(ReportsContext)
    const {collectionStatsDaily} = data

    const last28 = useMemo(() => {
        const dates = collectionStatsDaily.map(value => value.date)
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

        const tableData = collectionStatsDaily.map(value => {
            return {
                date: value.date,
                totalUsers: value.totalProfiles,
                listUsers: value.listUsers,
                totalSaves: value.totalSaves,
                ownUsers: value.listStats.find(list => list.listName === 'own')?.userCount,
                pickedUsers: value.listStats.find(list => list.listName === 'picked')?.userCount,
                scorecardUsers: value.listStats.find(list => list.listName === 'recordedLocks')?.userCount,
                wishlistUsers: value.listStats.find(list => list.listName === 'wishlist')?.userCount,
                newUsers: value.newListUsers
            }

        })


        return {
            title: '',
            columns: tableColumns,
            data: tableData.filter((dayData) => {
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

export default CollectionsLast28Table
