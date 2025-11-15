import React from 'react'
import {ResponsiveLine} from '@nivo/line'
import {primaryTheme} from '../../admin/adminChartDefaults'
import useWindowSize from '../../util/useWindowSize'
import dayjs from 'dayjs'

const RaffleReport28DaysLine = ({lineData}) => {

    const pageTrackingData = [lineData['rafl28days'].data]

    const siteLineData = []
    const raflHash = new Map()
    const raflPotsHash = new Map()
    const entryFormHash = new Map()

    pageTrackingData
        .forEach((value) => {
            const raflArray = []
            const raflPotsArray = []
            const entryFormArray = []

            for (let i = 0; i < value.length; i++) {
                let date = value[i]['date']
                if (dayjs(date) < dayjs('2024-12-25')) continue

                date = date + ' 23:59:59'

                const dataPoint = new Map()
                dataPoint['x'] = date
                dataPoint['y'] = value[i]['potListViews']
                raflArray.push(dataPoint)

                const dataPoint2 = new Map()
                dataPoint2['x'] = date
                dataPoint2['y'] = value[i]['potViews']
                raflPotsArray.push(dataPoint2)

                const dataPoint3 = new Map()
                dataPoint3['x'] = date
                dataPoint3['y'] = value[i]['raflForm']
                entryFormArray.push(dataPoint3)
            }
            raflHash['id'] = 'Pot List'
            raflHash['data'] = raflArray

            raflPotsHash['id'] = 'Pot Views'
            raflPotsHash['data'] = raflPotsArray

            entryFormHash['id'] = 'Entry Form'
            entryFormHash['data'] = entryFormArray

            siteLineData.push(raflPotsHash)
            siteLineData.push(raflHash)
            siteLineData.push(entryFormHash)
        })

    const {isMobile, width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560
    const midWindow = width <= 820

    const chartHeight =
        mobileSmall ? 200
            : mobileMedium ? 200
                : mobileLarge ? 210
                    : midWindow ? 230
                        : 350

    const chartMargin = !smallWindow
        ? {top: 10, right: 20, bottom: 70, left: 50}
        : {top: 10, right: 20, bottom: 50, left: 50}

    const tickValues = isMobile ? 'every 2 days' : 'every day'

    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveLine
                theme={primaryTheme}
                data={siteLineData}
                enableGridX={false}
                enableGridY={true}
                colors={['#5265ed', '#082fd1', '#4fa720']}
                lineWidth={3}
                margin={chartMargin}
                height={chartHeight}
                curve='basis'
                yScale={{
                    type: 'linear',
                    min: 0,
                    max: 'auto',
                    stacked: false,
                    reverse: false
                }}
                yFormat=' >-.0f'
                axisLeft={{
                    tickValues: 5,
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: ','
                }}
                xScale={{
                    type: 'time',
                    format: '%Y-%m-%d %H:%M:%S'
                }}
                xFormat='time:%m/%d/%y'
                axisBottom={{
                    format: '%b %d',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    direction: 'row',
                    legendOffset: -12,
                    tickValues: tickValues
                }}
                legends={[
                    {
                        anchor: 'bottom',
                        itemTextColor: '#bbb',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 70,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 20,
                        symbolSize: 13,
                        symbolShape: 'circle'
                    }
                ]}
                enablePoints={false}
                useMesh={true}
                isInteractive={true}
            />
        </div>
    )
}

export default RaffleReport28DaysLine
