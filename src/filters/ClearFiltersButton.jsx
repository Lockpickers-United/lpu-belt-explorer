import React, {useContext} from 'react'
import Button from '@mui/material/Button'
import FilterContext from '../contexts/FilterContext.jsx'
import AppContext from '../contexts/AppContext.jsx'
import {useCallback} from 'react'

function ClearFiltersButton(props) {
    const {tab, setTab} = useContext(AppContext)
    const {filters, clearFilters} = useContext(FilterContext)

    const handleClear = useCallback(() => {
        if (!filters.search && tab === 'search') setTab('White')
        setTimeout(() => clearFilters(), 100)
    }, [clearFilters, filters.search, setTab, tab])

    return (
        <Button variant='outlined' color='inherit' onClick={handleClear} style={{minWidth: 120}} {...props}>
            Clear&nbsp;Filters
        </Button>
    )
}

export default ClearFiltersButton
