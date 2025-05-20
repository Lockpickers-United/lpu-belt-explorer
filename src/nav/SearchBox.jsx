import Badge from '@mui/material/Badge'
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
import FilterContext from '../context/FilterContext'
import useWindowSize from '../util/useWindowSize'
import {useHotkeys} from 'react-hotkeys-hook'

function SearchBox({label, extraFilters = [], keepOpen}) {
    const [searchParams] = useSearchParams()
    const {addFilters, removeFilter, isFiltered} = useContext(FilterContext)
    const [text, setText] = useState(searchParams.get('search') || '')
    const {isMobile, width} = useWindowSize()
    const smallWidth = width <= 500

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

    const debounceText = useDebounce(text.replaceAll('\t', ' '), 250)
    useEffect(() => {
        if (!!debounceText && debounceText !== searchParams.get('search')) {
            if (debounceText) {
                window.scrollTo({top: 0})
                addFilters([
                    {key: 'search', value: debounceText},
                    {key: 'id', value: undefined},
                    {key: 'name', value: undefined},
                    ...extraFilters
                ], true)
            } else {
                // TODO isn't this useless?
                console.log('SearchBox: debounceText is empty')
                addFilters([
                    {key: 'search', value: debounceText}
                ], true)
            }
        } else if (!debounceText) {
            removeFilter('search', '')
        }
    }, [debounceText]) // eslint-disable-line

    const [open, setOpen] = useState(false)
    const handleBlur = useCallback(() => setTimeout(() => setOpen(false), 0), [])
    const handleClick = useCallback(() => {
        setOpen(true)
        setTimeout(() => {
            inputEl.current.focus()
            inputEl.current.select()
        }, 0)
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
        ? {maxWidth: 450, marginTop: 8,marginRight: 8}
        : {maxWidth: 450, marginTop: 6, marginRight: 8}

    const focusStyle = open && isMobile ? {
        width: 'auto',
        position: 'fixed',
        left: 50,
        right: 0,
        paddingRight: 16,
        maxWidth: 'unset',
        zIndex: 9999999,
        backgroundColor: '#272727'
    } : {}

    const iconColor = text ? 'secondary' : 'inherit'

    return (
        <React.Fragment>
            {(!open && isMobile && !keepOpen && !isFiltered) && <Tooltip title='Search' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleClick}>
                    <Badge
                        invisible={text.length === 0}
                        variant='dot'
                        color='secondary'
                        overlap='circular'
                        anchorOrigin={{
                            vertical: 'bottom', horizontal: 'right'
                        }}
                    >
                        <SearchIcon/>
                    </Badge>
                </IconButton>
            </Tooltip>}
            {(open || !isMobile || keepOpen || isFiltered) && <TextField
                placeholder={!smallWidth ? `Search ${label}` : label}
                InputProps={{
                    inputProps: {
                        ref: inputEl
                    },
                    startAdornment: (
                        <InputAdornment position='start'>
                            <SearchIcon color={iconColor}/>
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

export default SearchBox
