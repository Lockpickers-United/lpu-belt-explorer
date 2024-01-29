import React, {useState, useCallback} from 'react'
import BeltDistributionBar from './BeltDistributionBar.jsx'
import collectionBeltSaves from '../data/statsCollectionsFull.json'
import {ToggleButtonGroup} from '@mui/material'
import lockSummaryData from '../data/statsLockSummary.json'
import siteSummaryData from '../data/statsSiteSummary.json'
import StatsToggleButton from './StatsToggleButton.jsx'

const locksByBelt = lockSummaryData.locksByBelt
const lockViewsByBelt = siteSummaryData.lockViewsByBelt.data
const collectionSavesByBelt = collectionBeltSaves.savesByBelt

function BeltDistribution() {
    const [dataset, setDataset] = useState(lockViewsByBelt)
    const handleButtonClick = useCallback((newDataset) => {
        setDataset(newDataset)
    }, [])

    return (
        <React.Fragment>
            <div style={{textAlign: 'center'}}>

                <ToggleButtonGroup
                    variant='outlined'
                >
                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        dataset={dataset}
                        newDataset={lockViewsByBelt}
                        label='Site Views'
                    />

                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        dataset={dataset}
                        newDataset={locksByBelt}
                        label='Locks'
                    />

                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        dataset={dataset}
                        newDataset={collectionSavesByBelt}
                        label='Collection Saves'
                    />

                </ToggleButtonGroup>
                <BeltDistributionBar beltDistribution={dataset}/>
            </div>
        </React.Fragment>
    )
}

export default BeltDistribution
