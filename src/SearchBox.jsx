import {InputAdornment, TextField} from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'

function SearchBox({onSearch}) {
    const handleSearch = ({target}) => setTimeout(onSearch(target.value))
    return (
        <TextField
            placeholder='Quick Search'
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <SearchIcon/>
                    </InputAdornment>
                )
            }}
            variant='standard'
            color='secondary'
            onChange={handleSearch}
        />
    )
}

export default SearchBox
