import React from 'react'
import {ToggleButton} from '@mui/material'

function AdminToggleButton({handleButtonClick, dataset, newDataset, label, color}) {
    return (
        <ToggleButton
            onClick={() => {
                handleButtonClick(newDataset)
            }}
            style={{
                backgroundColor: color,
                padding: '6px 12px', borderColor: '#000', borderRadius: 0
            }}
            value={dataset}
        >{label}</ToggleButton>
    )
}

export default AdminToggleButton
