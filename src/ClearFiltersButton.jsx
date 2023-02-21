import React, {useContext} from 'react'
import Button from '@mui/material/Button'
import FilterContext from './FilterContext.jsx'

function ClearFiltersButton({tab, onChangeTab, ...props}) {
    const {filters, clearFilters} = useContext(FilterContext)

    const handleClear = () => {
        if (!filters.search && tab === 'search') onChangeTab('white')
        setTimeout(() => clearFilters(), 0)
    }

    return (
        <Button variant='outlined' color='inherit' onClick={handleClear} {...props}>
            Clear&nbsp;Filters
        </Button>
    )
}

export default ClearFiltersButton
