import {ToggleButton} from '@mui/material'
import React from 'react'

function StatsToggleButton({handleButtonClick, beltDistribution, dataset, label}) {

    return (
        <ToggleButton
            onClick={() => {
                handleButtonClick(dataset)
            }}
            style={{
                color: beltDistribution === dataset ? '#eee' : '#777',
                backgroundColor: beltDistribution === dataset ? '#292929' : '#111',
                padding: '6px 12px', borderColor: '#333', borderRadius:0
            }}
            value={dataset}
        >{label}</ToggleButton>
    )
}
export default StatsToggleButton