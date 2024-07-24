import React, {useMemo} from 'react'
import ScorecardBeltBar from './ScorecardBeltBar'
import {danBelts} from '../data/belts'

function InlineCollectionCharts({entries}) {

    console.log('entries', entries)

    const chartData = useMemo(() => {

        const beltDistribution = entries
            .map(({belt}) => belt && belt.includes('Project')
                ? 'Project'
                : belt
            )
            .reduce((acc, val) => {
                if (!acc[val]) acc[val] = 0
                acc[val]++
                return acc
            }, {})

        return danBelts.map(belt => ({
            id: belt,
            label: belt,
            count: beltDistribution[belt] || 0,
            value: beltDistribution[belt] || 0
        }))
    }, [entries])

    return (
        <div style={{width: '100%', marginTop: '0px'}}>
            <ScorecardBeltBar beltData={chartData}/>
        </div>
    )
}

export default InlineCollectionCharts
