import React from 'react'
import {uniqueBelts} from '../data/belts'
import useWindowSize from '../util/useWindowSize.jsx'
import AdminStatsTable from '../admin/AdminStatsTable.jsx'

export default function PlatformBeltCountsTable({data}) {

    /**
     * @prop beltedUsers
     * @prop belts
     * @prop dans
     */

    const {discordBeltCounts, redditBeltCounts} = data

    const discordTotal = Object.keys(discordBeltCounts)
        .filter(belt => belt.includes('Belt'))
        .reduce((acc, belt) => {
            return acc + discordBeltCounts[belt]
        }, 0)

    const redditTotal = Object.keys(redditBeltCounts)
        .filter(belt => belt.includes('Belt'))
        .reduce((acc, belt) => {
            return acc + redditBeltCounts[belt]
        }, 0)

    const barData = uniqueBelts.reduce((acc, belt) => {
        const fullBeltName = `${belt} Belt`
        acc.push({
            belt,
            discord: discordBeltCounts[fullBeltName],
            reddit: redditBeltCounts[fullBeltName],
        })
        return acc
    },[])

    barData.push({belt: 'Total', discord: discordTotal, reddit: redditTotal})

    const tableData = {
        columns: [
            {'name': 'Belt', 'align': 'left', 'id': 'belt'},
            {'name': 'Discord', 'align': 'center', 'id': 'discord'},
            {'name': 'Reddit', 'align': 'center', 'id': 'reddit'}
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