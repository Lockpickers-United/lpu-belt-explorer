import React, {useContext} from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme} from '../adminChartDefaults'
import ReportsContext from '../ReportsContext.jsx'

const CollectionListAveragesBar = ({cohort}) => {

    const {collectionSummary} = useContext(ReportsContext)

    const averageData = collectionSummary(cohort).data
        .filter(list => !['Raffle Watchlist','Awards', 'Projects'].includes(list.list))
        .map(list => ({
            id: list.list,
            label: list.list,
            count: list.averageSaves,
            value: list.averageSaves
        }))

    const chartHeight = 270
    const chartMargin = {top: 0, right: 20, bottom: 100, left: 50}

    const blueColors = ['#aeaeae', '#0364ac', '#0364ac',
        '#0364ac', '#0364ac', '#0364ac', '#0364ac',
        '#0364ac', '#0364ac', '#0364ac']

    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveBar
                data={averageData}
                margin={chartMargin}
                padding={0.15}
                colors={(bar) => blueColors[bar.index % blueColors.length]}
                animate={true}
                enableLabel={true}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0
                }}
                axisBottom={{
                    tickRotation: -45
                }}
                enableGridY={false}
                theme={primaryTheme}
                isInteractive={false}
            />
        </div>
    )
}
export default CollectionListAveragesBar
