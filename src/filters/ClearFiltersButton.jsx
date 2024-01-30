import React, {useContext} from 'react'
import Button from '@mui/material/Button'
import FilterContext from '../locks/FilterContext'

function ClearFiltersButton(props) {
    const {filterCount, clearFilters} = useContext(FilterContext)

    if (filterCount === 0) return null
    return (
        <Button variant='outlined' color='inherit' onClick={clearFilters} style={{minWidth: 120}} {...props}>
            Clear&nbsp;Filters
        </Button>
    )
}

export default ClearFiltersButton
