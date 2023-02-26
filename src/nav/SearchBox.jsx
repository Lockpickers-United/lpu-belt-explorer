import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {InputAdornment, TextField} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import FilterContext from '../contexts/FilterContext.jsx'
import AppContext from '../contexts/AppContext.jsx'
import useWindowSize from '../util/useWindowSize.js'
import debounce from 'debounce'

function SearchBox() {
    const {tab, setTab} = useContext(AppContext)
    const {filters, addFilter, removeFilter} = useContext(FilterContext)
    const [text, setText] = useState(filters.search || '')
    const {width} = useWindowSize()

    const handleClear = useCallback(() => {
        setText('')
        setTab('white')
        window.scrollTo({top: 0, behavior: 'smooth'})

        setTimeout(() => {
            removeFilter('search', '')
        }, 50)
    }, [setTab, removeFilter])

    const debounceChange = useMemo(() => {
        return debounce(value => {
            if (value === '') {
                handleClear()
            } else {
                addFilter('search', value, true)

                setTimeout(() => {
                    if (tab !== 'search') {
                        setTab('search')
                        window.scrollTo({top: 0, behavior: 'smooth'})
                    }
                }, 0)
            }
        }, 150)
    }, [addFilter, handleClear, setTab, tab])

    const handleChange = useCallback(event => {
        const {value} = event.target
        setText(value)
        debounceChange(value)
    }, [debounceChange])

    useEffect(() => {
        if (filters.search === undefined) {
            setText('')
            addFilter('search', '', true)
        }
    }, [addFilter, filters.search])

    const endAdornment = text ? (
        <InputAdornment position='end'>
            <IconButton color='inherit' onClick={handleClear} edge='end' size='small'>
                <ClearIcon/>
            </IconButton>
        </InputAdornment>
    ) : null
    const style = width < 650
        ? {maxWidth: 450}
        : {maxWidth: 450, paddingLeft: 20}

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
