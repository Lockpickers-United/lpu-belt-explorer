import ClearAllIcon from '@mui/icons-material/ClearAll'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useContext} from 'react'
import Button from '@mui/material/Button'
import useWindowSize from '../util/useWindowSize'
import FilterContext from '../context/FilterContext'

function ClearFiltersButton({forceText}) {
    const {isMobile} = useWindowSize()
    const {filterCount, clearFilters} = useContext(FilterContext)

    if (filterCount === 0) return null
    if (isMobile && !forceText) {
        return (
            <Tooltip title='Clear Filters' arrow disableFocusListener>
                <IconButton onClick={clearFilters}>
                    <ClearAllIcon/>
                </IconButton>
            </Tooltip>
        )
    } else {
        return (
            <Button variant='outlined' color='inherit' onClick={clearFilters} style={{minWidth: 80, marginRight:8}}>
                Clear
            </Button>
        )
    }
}

export default ClearFiltersButton
