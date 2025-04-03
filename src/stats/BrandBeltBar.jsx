import React from 'react'
import {beltColors, primaryTheme} from './chartDefaults'
import useWindowSize from '../util/useWindowSize'
import {ResponsiveBar} from '@nivo/bar'

function BrandBeltBar({beltData}) {

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const smallWindow = width <= 560

    const chartHeight = mobileSmall ? 170
        : smallWindow ? 200
            :  180

    const mb = 50
    const chartMargin = !smallWindow
        ? {top: 0, right: 10, bottom: mb, left: 10}
        : {top: 0, right: 20, bottom: mb, left: 20}

    const labelColors =
        ['#000','#000','#000','#000',
        '#000','#000','#000',
            '#000','#ddd','#ddd']

    return (
        <div key='bar'
             style={{height: chartHeight, padding: '0px 8px 0px 8px', width: '100%'}}
        >
            <ResponsiveBar
                data={beltData}
                //maxValue={0.20}
                margin={chartMargin}
                padding={0.15}
                colors={(bar) => beltColors[bar.index % beltColors.length]}
                animate={true}
                axisBottom={{
                    tickRotation: -45
                }}
                axisLeft={null}
                enableGridY={false}
                theme={primaryTheme}
                isInteractive={false}

                enableLabel={true}
                label={e => e.data.count}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={(bar) => labelColors[bar.index % labelColors.length]}
            />
        </div>)
}

export default BrandBeltBar
