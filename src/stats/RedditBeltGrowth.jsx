import React from 'react'
import {ResponsiveBar} from '@nivo/bar'
import useWindowSize from '../util/useWindowSize.jsx'
import {beltColors, legendTheme} from './chartDefaults.js'
import {primaryTheme} from './chartDefaults.js'
import beltRankingAnnualData from '../data/redditBeltGrowthAnnualData.json'
import redditBeltGrowthLegend from './redditBeltGrowthLegend.json'

function RedditBeltGrowth() {

    const {width} = useWindowSize()
    const smallWidth = width < 500
    const midWidth = width < 700
    const chartHeight = !midWidth ? 350 : !smallWidth ? 300 : 220
    const borderRadius = !smallWidth ? 3 : 2

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveBar
                data={beltRankingAnnualData}
                keys={[
                    'White', 'Yellow', 'Orange', 'Green', 'Blue',
                    'Purple', 'Brown', 'Red', 'Black'
                ]}
                indexBy='date'
                groupMode='stacked'
                margin={{top: 10, right: 20, bottom: 50, left: 55}}
                padding={0.1}
                innerPadding={0.5}
                borderRadius={borderRadius}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                maxValue={8000}

                theme={primaryTheme}
                colors={beltColors}
                animate={true}
                enableLabel={true}
                enableGridY={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={'#222'}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: ','
                }}
                isInteractive={true}
            />

            {/* second chart just to display totals */}
            <div style={{height: 30, marginTop: -20}}>
                <ResponsiveBar
                    data={redditBeltGrowthLegend}
                    indexBy='total'
                    margin={{top: 10, right: 20, bottom: 40, left: 55}}
                    maxValue={0}
                    theme={legendTheme}
                    axisLeft={null}
                    enableGridY={false}
                    enableGridX={false}
                    animate={true}
                    isInteractive={false}
                />
            </div>
        </div>
    )
}

export default RedditBeltGrowth
