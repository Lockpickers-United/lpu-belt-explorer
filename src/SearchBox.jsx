import {InputAdornment, TextField} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import {useMediaQuery} from 'react-responsive'

function SearchBox({searchTerm, onSearch}) {
    const isBigEnough = useMediaQuery({minWidth: 736})
    const handleSearch = ({target}) => setTimeout(onSearch(target.value))
    const handleClear = () => onSearch('')
    const endAdornment = searchTerm ? (
        <InputAdornment position='end'>
            <IconButton color='inherit' onClick={handleClear} edge='end' size='small'>
                <ClearIcon/>
            </IconButton>
        </InputAdornment>
    ) : null
    const style = isBigEnough
        ? {maxWidth: 450, marginRight: -60}
        : {maxWidth: 450}

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
            style={style}
            fullWidth
        />
    )
}

export default SearchBox
