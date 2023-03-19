import React, {useCallback, useContext} from 'react'
import Chip from '@mui/material/Chip'
import FilterContext from '../contexts/FilterContext'

function FilterChip({field, value, ...props}) {
    const {addFilter} = useContext(FilterContext)

    const handleClick = useCallback(event => {
        event.stopPropagation()

        setTimeout(() => addFilter(field, value), 0)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [addFilter, field, value])

    return (
        <Chip
            clickable
            variant='outlined'
            label={value}
            style={{marginRight: 4, marginBottom: 4}}
            onClick={handleClick}
            {...props}
        />
    )
}

export default FilterChip
