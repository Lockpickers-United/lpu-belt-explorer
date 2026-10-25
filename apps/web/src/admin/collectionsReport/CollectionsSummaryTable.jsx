import React, {useContext, useMemo} from 'react'
import AdminStatsTable from '../AdminStatsTable'
import useWindowSize from '../../util/useWindowSize'
import ReportsContext from '../ReportsContext.jsx'

const CollectionsSummaryTable = ({cohort}) => {

    const {data, allDataLoaded} = useContext(ReportsContext)
    const {collectionsStatsCurrent} = data

    const collectionSummary = useMemo(() => (allDataLoaded
            ? {
                columns: [
                    {name: 'List Name', id: 'list', align: 'left'},
                    {align: 'center', id: 'totalUsers', name: 'Total Users'},
                    {name: 'List Users', align: 'center', id: 'userCount'},
                    {id: 'totalSaves', align: 'center', name: 'Total Saves'},
                    {name: '% List Users', id: 'percentListUsers', align: 'center'},
                    {id: 'averageSaves', align: 'center', name: 'Average Items'}
                ],
                data: collectionList.map(list => {
                    const {
                        userCount,
                        totalSaves,
                        averageSaves
                    } = collectionsStatsCurrent[cohort].listStats[list.listName]
                    return {
                        totalUsers: collectionsStatsCurrent[cohort].totalProfiles,
                        list: list.label,
                        userCount,
                        listUsers: userCount,
                        totalSaves,
                        percentListUsers: Math.round(100 * userCount / collectionsStatsCurrent[cohort].listStats.allLists.userCount) + '%',
                        averageSaves: Math.round(averageSaves)
                    }
                })
            }
            : {}
    ), [allDataLoaded, cohort, collectionsStatsCurrent])

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

const collectionList = [
    {listName: 'allLists', label: 'All Lists'},
    {listName: 'own', label: 'Own'},
    {listName: 'picked', label: 'Picked'},
    {listName: 'recorded', label: 'Recorded'},
    {listName: 'recordedLocks', label: 'Scorecard'},
    {listName: 'wishlist', label: 'Wishlist'},
    {listName: 'safelocksOwn', label: 'Safelocks Own'},
    {listName: 'safelocksCracked', label: 'Safelocks Cracked'},
    {listName: 'safelocksWishlist', label: 'Safelocks Wishlist'},
    {listName: 'raffleWatchlist', label: 'Raffle Watchlist'},
    {listName: 'awards', label: 'Awards'},
    {listName: 'projects', label: 'Projects'}
]


export default CollectionsSummaryTable
