import Backdrop from '@mui/material/Backdrop'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import {useNavigate} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize'

function LeaderboardSearchBox({data}) {
    const style = {maxWidth: 450}
    const {isMobile} = useWindowSize()
    const navigate = useNavigate()
    const inputEl = useRef()

    const options = data.data
        .filter(item => item.displayName)
        .map(item => item.displayName)

    const handleChange = useCallback((event, value) => {
        if (!value) {
            navigate('/leaderboard')
        } else if (options.includes(value)) {
            navigate(`/leaderboard?user=${value}`)
        }
    }, [navigate, options])

    const [open, setOpen] = useState(false)
    const handleClick = useCallback(() => {
        setOpen(true)
        setTimeout(() => inputEl.current.focus(), 15)
    }, [])
    const handleBlur = useCallback(() => setOpen(false), [])

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
            {(open || !isMobile) && <Autocomplete
                selectOnFocus
                clearOnEscape
                handleHomeEndKeys
                fullWidth
                style={{...style, ...focusStyle}}
                options={options}
                onChange={handleChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder='Search'
                        variant='standard'
                        color='secondary'
                        inputRef={inputEl}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon/>
                                </InputAdornment>
                            )
                        }}
                    />
                }
            />}
            <Backdrop
                invisible
                open={open && isMobile}
                onClick={handleBlur}
            />
        </React.Fragment>
    )
}

export default LeaderboardSearchBox
