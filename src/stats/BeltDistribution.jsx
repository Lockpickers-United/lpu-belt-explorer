import React, {useState, useCallback} from 'react'
import BeltDistributionBar from './BeltDistributionBar.jsx'
import collectionBeltSaves from '../data/collectionBeltSavesData.json'
import {ToggleButtonGroup} from '@mui/material'
import lockSummaryData from '../data/lockSummaryData.json'
import siteSummaryData from '../data/siteSummaryData.json'
import StatsToggleButton from './StatsToggleButton.jsx'

const locksByBelt = lockSummaryData.locksByBelt
const lockViewsByBelt = siteSummaryData.lockViewsByBelt.data

function BeltDistribution() {

    const [beltDistribution, setBeltDistribution] = useState(lockViewsByBelt)
    const handleButtonClick = useCallback((dataset) => {
        setBeltDistribution(dataset)
    }, [])

    return (
        <React.Fragment>
            <div style={{textAlign: 'center'}}>

                <ToggleButtonGroup
                    variant='outlined'
                    value={beltDistribution}
                >
                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        beltDistribution={beltDistribution}
                        dataset={lockViewsByBelt}
                        label='Site Views'
                    />

                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        beltDistribution={beltDistribution}
                        dataset={locksByBelt}
                        label='Locks'
                    />

                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        beltDistribution={beltDistribution}
                        dataset={collectionBeltSaves}
                        label='Collection Saves'
                    />

                </ToggleButtonGroup>
                <BeltDistributionBar beltDistribution={beltDistribution}/>
            </div>
        </React.Fragment>
    )
}

export default BeltDistribution
