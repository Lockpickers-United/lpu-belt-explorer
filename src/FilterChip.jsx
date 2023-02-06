import React from 'react'
import Chip from '@mui/material/Chip'
import queryString from 'query-string'

function FilterChip({field, value, ...props}) {
    const handleClick = () => {
        const query = queryString.parse(location.search)
        const queryValue = query[field]
        if (Array.isArray(queryValue)) queryValue.push(value)
        else if (queryValue) query[field] = [queryValue, value]
        else query[field] = value
        location.search = queryString.stringify(query)
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
