import React, {useContext} from 'react'
import Button from '@mui/material/Button'
import FilterContext from '../contexts/FilterContext.jsx'
import AppContext from '../contexts/AppContext.jsx'

function ClearFiltersButton(props) {
    const {tab, setTab} = useContext(AppContext)
    const {filters, clearFilters} = useContext(FilterContext)

    const handleClear = () => {
        if (!filters.search && tab === 'search') setTab('White')
        setTimeout(() => clearFilters(), 100)
    }

    return (
        <Button variant='outlined' color='inherit' onClick={handleClear} {...props}>
            Clear&nbsp;Filters
        </Button>
    )
}

export default ClearFiltersButton
