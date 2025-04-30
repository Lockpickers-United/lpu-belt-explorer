import React from 'react'
import PlatformBeltBar from './PlatformBeltBar.jsx'
import {uniqueBelts} from '../data/belts'

export default function PlatformBeltCountsChart({data}) {

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
            Discord: discordBeltCounts[fullBeltName] / discordTotal,
            Reddit: redditBeltCounts[fullBeltName] / redditTotal,
            DiscordColor: '#38bcb2'
        })
        return acc
    }, [])


    return (
            <PlatformBeltBar beltDistribution={barData}/>
    )

}