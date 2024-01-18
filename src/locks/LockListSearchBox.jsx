import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import Backdrop from '@mui/material/Backdrop'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import {useSearchParams} from 'react-router-dom'
import {useDebounce} from 'usehooks-ts'
import FilterContext from './FilterContext'
import useWindowSize from '../util/useWindowSize'
import {useHotkeys} from 'react-hotkeys-hook'

function LockListSearchBox() {
    const [searchParams] = useSearchParams()
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

    const handleChange = useCallback(event => {
        const {value} = event.target
        setText(value)
    }, [])

    const debounceText = useDebounce(text, 250)
    useEffect(() => {
        if (debounceText !== searchParams.get('search')) {
            if (debounceText) {
                window.scrollTo({top: 0})
                addFilters([
                    {key: 'search', value: debounceText},
                    {key: 'tab', value: 'search'},
                    {key: 'id', value: undefined},
                    {key: 'name', value: undefined}
                ], true)
            } else {
                addFilters([
                    {key: 'search', value: debounceText}
                ], true)
            }
        }
    }, [debounceText]) // eslint-disable-line

    const [open, setOpen] = useState(false)
    const handleBlur = useCallback(() => setTimeout(() => setOpen(false), 0), [])
    const handleClick = useCallback(() => {
        setOpen(true)
        setTimeout(() => inputEl.current.focus(), 0)
    }, [])

    useEffect(() => {
        const newValue = searchParams.get('search')
        if (newValue !== text) {
            setText(newValue || '')
        }
    }, [searchParams]) // eslint-disable-line

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
            />}
            <Backdrop
                invisible
                open={open && isMobile}
                onClick={handleBlur}
            />
        </React.Fragment>
    )
}

export default LockListSearchBox
