import {InputAdornment, TextField} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

function SearchBox({searchTerm, onSearch}) {
    const handleSearch = ({target}) => setTimeout(onSearch(target.value))
    const handleClear = () => onSearch('')
    const endAdornment = searchTerm ? (
        <InputAdornment position='end'>
            <IconButton color='inherit' onClick={handleClear} edge='end' size='small'>
                <ClearIcon/>
            </IconButton>
        </InputAdornment>
    ) : null

    return (
        <TextField
            placeholder='Quick Search'
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <SearchIcon/>
                    </InputAdornment>
                ),
                endAdornment
            }}
            variant='standard'
            color='secondary'
            onChange={handleSearch}
            value={searchTerm}
            style={{maxWidth: 400}}
            fullWidth
        />
    )
}

export default SearchBox
