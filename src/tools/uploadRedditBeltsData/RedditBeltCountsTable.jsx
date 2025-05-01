import React from 'react'
import {uniqueBelts} from '../../data/belts'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminStatsTable from '../../admin/AdminStatsTable.jsx'

export default function RedditBeltCountsTable({data}) {

    /**
     * @prop beltedUsers
     * @prop belts
     * @prop dans
     */

    const redditTotal = Object.keys(data)
        .filter(belt => belt.includes('Belt'))
        .reduce((acc, belt) => {
            return acc + data[belt]
        }, 0)

    const barData = uniqueBelts.reduce((acc, belt) => {
        const fullBeltName = `${belt} Belt`
        acc.push({
            belt,
            reddit: data[fullBeltName],
        })
        return acc
    },[])

    barData.push({belt: 'Total', reddit: redditTotal})

    const tableData = {
        columns: [
            {'name': 'Belt', 'align': 'left', 'id': 'belt'},
            {'name': 'Reddit Count', 'align': 'center', 'id': 'reddit'}
        ],
        data: barData
    }


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

    const tableWidth = 300

    return (
        <AdminStatsTable tableData={tableData} tableWidth={tableWidth} fontSize={fontSize}/>
    )

}