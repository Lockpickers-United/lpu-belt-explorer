import React, {useContext} from 'react'
import {ResponsiveBar} from '@nivo/bar'
import useWindowSize from '../../util/useWindowSize'
import {beltColors, primaryTheme} from '../adminChartDefaults'
import ReportsContext from '../ReportsContext.jsx'

const CollectionSavesByBeltBar = ({cohort}) => {

    const {data, collectionListLabels} = useContext(ReportsContext)
    const listSaves = data.collectionsStatsCurrent[cohort].listSavesByBelt


    const lists = ['own', 'picked', 'wishlist', 'recordedLocks']
    const listSavesByBelt = lists.map(list => {
        return {...listSaves[list], list: collectionListLabels[list]}
    })

    const {width} = useWindowSize()
    const smallWindow = width <= 560

    const chartHeight = 270

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
