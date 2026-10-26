import React from 'react'
import PlatformBeltBar from './PlatformBeltBar.jsx'
import {uniqueBelts} from '../data/belts'
import useWindowSize from '../util/useWindowSize.jsx'

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

    const reverseBelts = [...uniqueBelts].reverse()
    const barData = reverseBelts.reduce((acc, belt) => {
        const fullBeltName = `${belt} Belt`
        acc.push({
            belt,
            Discord: discordBeltCounts[fullBeltName] / discordTotal,
            Reddit: redditBeltCounts[fullBeltName] / redditTotal,
            DiscordColor: '#38bcb2'
        })
        return acc
    }, [])

    const {isMobile} = useWindowSize()
    const titleOffset = isMobile ? 0 : 70
    const marginTop = isMobile ? 20 : 0
    const marginBottom = isMobile ? 5 : 38

    return (
        <div style={{width: 330, textAlign: 'center', padding: '0px 0px 0px 0px', marginTop: marginTop}}>
            <div style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: marginBottom,
                paddingLeft: titleOffset
            }}>
                Belt Percentages
            </div>

            <PlatformBeltBar beltDistribution={barData}/>
        </div>
    )

}