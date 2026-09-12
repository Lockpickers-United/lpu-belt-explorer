import Badge from '@mui/material/Badge'
import React, {useCallback, useContext, useEffect, useId, useRef, useState} from 'react'
import Backdrop from '@mui/material/Backdrop'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import {useLocation, useSearchParams} from 'react-router-dom'
import {useDebounceValue} from 'usehooks-ts'
import FilterContext from '../context/FilterContext'
import useWindowSize from '../util/useWindowSize'
import {useHotkeys} from 'react-hotkeys-hook'
import Tracker from '../app/Tracker'

const searchUpdateStateKey = '__searchBoxUpdateId'

function SearchBox({label, extraFilters = [], entryCount = 0, keepOpen}) {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const {addFilters, removeFilter, isFiltered} = useContext(FilterContext)
    const [text, setText] = useState(searchParams.get('search') || '')
    const textRef = useRef(text)
    const pendingSearchUpdatesRef = useRef(new Set())
    const searchBoxInstanceId = useId()
    const searchUpdateSequenceRef = useRef(0)
    const {isMobile, width} = useWindowSize()
    const smallWidth = width <= 500

    const inputEl = useRef()
    useHotkeys('s', () => inputEl?.current?.focus(), {preventDefault: true})

    const placeholder = (entryCount > 1) ? `Search ${entryCount ? entryCount.toString() + ' ' : ''}${label}` : 'Search'

    const handleChange = useCallback(event => {
        const value = event.target.value.replaceAll('\t', ' ')
        textRef.current = value
        setText(value)
    }, [])

    const queueSearchUpdate = useCallback(value => {
        const currentValue = searchParams.get('search') || ''
        if (value === currentValue && pendingSearchUpdatesRef.current.size === 0) return

        const updateId = `${searchBoxInstanceId}-${++searchUpdateSequenceRef.current}`
        pendingSearchUpdatesRef.current.add(updateId)
        const currentState = location.state && typeof location.state === 'object' ? location.state : {}
        const navigationOptions = {
            state: {
                ...currentState,
                [searchUpdateStateKey]: updateId
            }
        }

        if (value) {
            window.scrollTo({top: 0})
            addFilters([
                {key: 'search', value},
                {key: 'id', value: undefined},
                {key: 'name', value: undefined},
                ...extraFilters
            ], true, navigationOptions)
        } else {
            removeFilter('search', '', navigationOptions)
        }
    }, [addFilters, extraFilters, location.state, removeFilter, searchBoxInstanceId, searchParams])

    const handleClear = useCallback(() => {
        window.scrollTo({top: 0})
        textRef.current = ''
        setText('')
        queueSearchUpdate('')
        inputEl.current.focus()
    }, [queueSearchUpdate])

    const [debounceText] = useDebounceValue(text, 250)
    const lastHandledDebounceRef = useRef(debounceText)
    useEffect(() => {
        if (debounceText === lastHandledDebounceRef.current) return
        lastHandledDebounceRef.current = debounceText
        queueSearchUpdate(debounceText)
    }, [debounceText, queueSearchUpdate])

    // 2 sec debounce specifically for tracking the final search term
    const [debounceTrack] = useDebounceValue(text.replaceAll('\t', ' ').trim(), 2000)
    const [trackerTerm, setTrackerTerm] = useState(null)
    useEffect(() => {
        if (debounceTrack) {
            // mount Tracker for one render, then unmount to avoid duplicate pings
            setTrackerTerm(debounceTrack)
            const t = setTimeout(() => setTrackerTerm(null), 0)
            return () => clearTimeout(t)
        }
        // if cleared, do nothing
    }, [debounceTrack])

    const [open, setOpen] = useState(false)
    const handleBlur = useCallback(() => setTimeout(() => setOpen(false), 0), [])
    const handleFocus = useCallback(() => setOpen(true), [])
    const handleClick = useCallback(() => {
        setOpen(true)
        setTimeout(() => {
            inputEl.current.focus()
            inputEl.current.select()
        }, 0)
    }, [])

    useEffect(() => {
        const searchUpdateId = location.state?.[searchUpdateStateKey]
        if (pendingSearchUpdatesRef.current.has(searchUpdateId)) {
            pendingSearchUpdatesRef.current.delete(searchUpdateId)
            return
        }

        pendingSearchUpdatesRef.current.clear()
        const newValue = searchParams.get('search') || ''
        if (newValue !== textRef.current) {
            textRef.current = newValue
            setText(newValue)
        }
    }, [location.state, searchParams])

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
                placeholder={!smallWidth ? placeholder : label}
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
                onFocus={handleFocus}
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
            {trackerTerm && <Tracker feature='search' search={trackerTerm} />}
        </React.Fragment>
    )
}

export default SearchBox
