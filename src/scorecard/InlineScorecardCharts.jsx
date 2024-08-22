import React, {useMemo} from 'react'
import ScorecardBeltBar from './ScorecardBeltBar'
import {danBelts, danBeltsFull} from '../data/belts'

function InlineCollectionCharts({entries}) {

    const chartData = useMemo(() => {

        const beltDistribution = entries
            .map(({belt}) => belt && belt.includes('Project')
                ? belt //was 'Project'
                : belt
            )
            .reduce((acc, val) => {
                if (!acc[val]) acc[val] = 0
                acc[val]++
                return acc
            }, {})

        beltDistribution['Project'] = entries.reduce((acc, entry) => {
            return (entry.simpleBelt === 'Project')
                ? acc + 1
                : acc
        }, 0)

        let beltList = beltDistribution['Project'] > 0
            ? danBeltsFull
            : danBelts

        if (!beltDistribution['Unranked']) {
            beltList = beltList.filter(belt => belt !== 'Unranked')
        }

        return beltList.map(belt => ({
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
