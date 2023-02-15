import React, {useCallback, useContext, useEffect, useState} from 'react'
import {InputAdornment, TextField} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import FilterContext from './FilterContext.jsx'
import StorageContext from './StorageContext.jsx'

function SearchBox({tab, onChangeTab, isMobile}) {
    const {filters, addFilter, removeFilter} = useContext(FilterContext)
    const [text, setText] = useState(filters.search || '')
    const [settled, setSettled] = useState(true)
    const {featureFlags, setStorageValue} = useContext(StorageContext)
    const {isBetaUser = false} = featureFlags

    const handleClear = useCallback(() => {
        setText('')
        removeFilter('search', '')
        onChangeTab('white')
    }, [onChangeTab, removeFilter])

    const handleChange = useCallback(event => {
        const value = event.target.value
        setSettled(false)
        if (value === 'lpubeta') {
            setStorageValue('featureFlags', {...featureFlags, isBetaUser: !isBetaUser})
            onChangeTab('white')
            setText('')
            removeFilter('search')
        } else {
            if (value === '') {
                handleClear()
            } else {
                setText(value)
                setTimeout(() => {
                    addFilter('search', value, true)
                    if (tab !== 'search') onChangeTab('search')
                }, 0)
            }
        }
    }, [addFilter, featureFlags, handleClear, isBetaUser, onChangeTab, removeFilter, setStorageValue, tab])

    useEffect(() => {
        if (settled && !Object.hasOwn(filters, 'search') && text) {
            setTimeout(() => setText(''))
        } else {
            setSettled(true)
        }
    }, [filters, settled, text])

    const endAdornment = text ? (
        <InputAdornment position='end'>
            <IconButton color='inherit' onClick={handleClear} edge='end' size='small'>
                <ClearIcon/>
            </IconButton>
        </InputAdornment>
    ) : null
    const style = isMobile
        ? {maxWidth: 450}
        : {maxWidth: 450, marginRight: -60}

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
