import React, {useContext} from 'react'
import Button from '@mui/material/Button'
import FilterContext from '../contexts/FilterContext'

function ClearFiltersButton(props) {
    const {clearFilters} = useContext(FilterContext)

    return (
        <Button variant='outlined' color='inherit' onClick={clearFilters} style={{minWidth: 120}} {...props}>
            Clear&nbsp;Filters
        </Button>
    )
}

export default ClearFiltersButton
