import React from 'react'
import {ResponsiveBar} from '@nivo/bar'
import useWindowSize from '../util/useWindowSize'
import {beltColors, primaryTheme} from './adminChartDefaults'

const CollectionSavesByBeltBar = ({data}) => {
    const {listSavesByBelt} = data

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560
    const midWindow = width <= 820

    const chartHeight =
        mobileSmall ? 200
            : mobileMedium ? 200
                : mobileLarge ? 200
                    : midWindow ? 250
                        : 290

    const borderRadius = !smallWindow ? 2 : 1
    const chartMargin = {top: 0, right: 20, bottom: 30, left: 50}

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveBar
                data={listSavesByBelt}
                keys={[
                    'White', 'Yellow', 'Orange', 'Green', 'Blue',
                    'Purple', 'Brown', 'Red', 'Black', 'Unranked'
                ]}
                indexBy='list'
                groupMode='grouped'
                margin={chartMargin}
                padding={0.1}
                innerPadding={0}
                borderRadius={borderRadius}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                maxValue='auto'

                theme={primaryTheme}
                colors={beltColors}
                animate={true}
                enableGridY={false}
                enableLabel={false}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: ','
                }}
                isInteractive={true}
            />
        </div>
    )
}

export default CollectionSavesByBeltBar
