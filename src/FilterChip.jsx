import React, {useContext} from 'react'
import Chip from '@mui/material/Chip'
import FilterContext from './FilterContext.jsx'

function FilterChip({field, value, ...props}) {
    const {addFilter} = useContext(FilterContext)

    const handleClick = event => {
        event.stopPropagation()

        addFilter(field, value)
    }

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
