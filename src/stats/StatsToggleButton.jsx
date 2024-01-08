import React from 'react'
import {ToggleButton} from '@mui/material'

function StatsToggleButton({handleButtonClick, dataset, newDataset, label}) {

    return (
        <ToggleButton
            onClick={() => {
                handleButtonClick(newDataset)
            }}
            style={{
                color: dataset === newDataset ? '#eee' : '#777',
                backgroundColor: dataset === newDataset ? '#292929' : '#111',
                padding: '6px 12px', borderColor: '#000', borderRadius: 0
            }}
            value={dataset}
        >{label}</ToggleButton>
    )
}

export default StatsToggleButton