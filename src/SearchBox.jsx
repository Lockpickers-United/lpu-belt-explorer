import {InputAdornment, TextField} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import React, {useContext, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import {useMediaQuery} from 'react-responsive'
import FilterContext from './FilterContext.jsx'

function SearchBox({onChangeTab}) {
    const isBigEnough = useMediaQuery({minWidth: 736})
    const {filters, addFilter, removeFilter, setIsBetaUser, isBetaUser} = useContext(FilterContext)
    const [text, setText] = useState(filters.search || '')
    const handleChange = event => {
        const value = event.target.value
        if (value === 'lpubeta') {
            setIsBetaUser(!isBetaUser)
            onChangeTab('white')
            setText('')
            addFilter('search', '', true)
        } else {
            setText(value)
            setTimeout(() => {
                addFilter('search', value, true)
                onChangeTab('search')
            }, 0)
        }
    }
    const handleClear = () => {
        setText('')
        removeFilter('search', '')
        onChangeTab('white')
    }

    const endAdornment = text ? (
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
            onChange={handleChange}
            value={text}
            style={style}
            fullWidth
        />
    )
}

export default SearchBox
