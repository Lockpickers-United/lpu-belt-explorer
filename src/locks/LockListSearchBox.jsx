import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import Backdrop from '@mui/material/Backdrop'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import {useLocation} from 'react-router-dom'
import FilterContext from './FilterContext'
import useWindowSize from '../util/useWindowSize'
import debounce from 'debounce'
import {useHotkeys} from 'react-hotkeys-hook'

function LockListSearchBox() {
    const location = useLocation()
    const {filters, addFilters, removeFilter} = useContext(FilterContext)
    const [text, setText] = useState(filters.search || '')
    const {isMobile} = useWindowSize()
    const inputEl = useRef()
    useHotkeys('s', () => inputEl?.current?.focus(), {preventDefault: true})

    const handleClear = useCallback(() => {
        window.scrollTo({top: 0})
        setText('')
        removeFilter('search', '')
        inputEl.current.focus()
    }, [removeFilter])

    const debounceChange = useMemo(() => {
        return debounce(value => {
            addFilters([
                {key: 'search', value},
                {key: 'tab', value: 'search'},
                {key: 'id', value: undefined},
                {key: 'name', value: undefined}
            ], true)
            window.scrollTo({top: 0})
        }, 150)
    }, [addFilters])

    const handleChange = useCallback(event => {
        const {value} = event.target
        setText(value)
        debounceChange(value)
    }, [debounceChange])

    const [open, setOpen] = useState(false)
    const handleBlur = useCallback(() => setTimeout(() => setOpen(false), 0), [])
    const handleClick = useCallback(() => {
        setOpen(true)
        setTimeout(() => inputEl.current.focus(), 0)
    }, [])

    useEffect(() => {
        if (filters.search !== text) {
            setText(filters.search)
        }
    }, [location]) // eslint-disable-line

    const endAdornment = text ? (
        <InputAdornment position='end'>
            <Tooltip title='Clear' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleClear} edge='end' size='small'>
                    <ClearIcon/>
                </IconButton>
            </Tooltip>
        </InputAdornment>
    ) : null


    const style = isMobile
        ? {maxWidth: 450, marginRight: 8}
        : {maxWidth: 450, paddingLeft: 60, marginRight: 8}

    const focusStyle = open && isMobile ? {
        width: 'auto',
        position: 'fixed',
        left: 60,
        right: 0,
        paddingRight: 16,
        maxWidth: 'unset',
        zIndex: 9999999,
        backgroundColor: '#272727'
    } : {}

    return (
        <React.Fragment>
            {!open && isMobile && <Tooltip title='Search' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleClick}>
                    <SearchIcon/>
                </IconButton>
            </Tooltip>}
            {(open || !isMobile) && <TextField
                placeholder='Search'
                InputProps={{
                    inputProps: {
                        ref: inputEl
                    },
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
                onBlur={handleBlur}
                value={text}
                style={{...style, ...focusStyle}}
                fullWidth
            /> }
            <Backdrop
                invisible
                open={open && isMobile}
                onClick={handleBlur}
            />
        </React.Fragment>
    )
}

export default LockListSearchBox
