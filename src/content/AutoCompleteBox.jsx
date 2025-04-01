import Backdrop from '@mui/material/Backdrop'
import React, {useCallback, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useWindowSize from '../util/useWindowSize'

function AutoCompleteBox({name, changeHandler, options, style, disabled = false, reset, placeholder = 'Search...'}) {
    const inputEl = useRef()
    const [open, setOpen] = useState(false)
    const handleBlur = useCallback(() => setOpen(false), [])
    const {isMobile} = useWindowSize()

    const handleChange = useCallback((event, value) => {
        if (options.includes(value)) {
            changeHandler({target: {name: name, value: value}})
        } else {
            changeHandler({target: {name: name, value: undefined}})
        }
    }, [options, changeHandler, name])

    return (
        <React.Fragment>
            <Autocomplete
                disabled={disabled}
                key={reset || disabled}
                selectOnFocus
                clearOnEscape
                handleHomeEndKeys
                autoHighlight
                fullWidth
                style={style}
                options={options}
                name={name}
                onChange={handleChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        variant='outlined'
                        color='info'
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
            />
            <Backdrop
                invisible
                open={open && isMobile}
                onClick={handleBlur}
            />
        </React.Fragment>
    )
}

export default AutoCompleteBox
