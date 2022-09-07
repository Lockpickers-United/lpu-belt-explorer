import {Tooltip} from '@mui/material'
import React from 'react'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff.js'
import IconButton from '@mui/material/IconButton'

function ClearFilterButton({onSearch}) {
    const handleClick = () => {
        onSearch('')
        location.search = ''
    }
    return (
        <Tooltip title='Clear filters'>
            <IconButton color='inherit' onClick={handleClick}>
                <FilterAltOffIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default ClearFilterButton
