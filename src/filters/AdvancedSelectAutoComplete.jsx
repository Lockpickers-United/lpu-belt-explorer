import Backdrop from '@mui/material/Backdrop'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useWindowSize from '../util/useWindowSize.jsx'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'

export default function AdvancedSelectAutoComplete({
                                                       props,
                                                       reset,
                                                       noOptionsMessage,
                                                       noOptionsHandler,
                                                       inputValueHandler
                                                   }) {

    const {
        label,
        size,
        filteredOptions,
        filterValueNames,
        counts,
        fieldName,
        fieldWidth,
        noMoreOptions,
        displayValueText,
        handleSelect,
        selectStyle
    } = props

    const inputEl = useRef()
    const [open, setOpen] = useState(false)
    const handleBlur = useCallback(() => setOpen(false), [])
    const {isMobile} = useWindowSize()
    const [inputValue, setInputValue] = useState(displayValueText)

    // Keep the visible input text in sync with the selected value text from props
    useEffect(() => {
        setInputValue(displayValueText || '')
    }, [displayValueText])

    const noOptionsText = noOptionsMessage && !!noOptionsHandler
        ? <Button onClick={noOptionsHandler} variant='contained' color='success'>
            {noOptionsMessage}
        </Button>
        : null

    const handleChange = useCallback((_event, value) => {
        if (filteredOptions.includes(value)) {
            handleSelect({target: {name: fieldName, value: value}})
        } else {
            handleSelect({target: {name: fieldName, value: undefined}})
        }
    }, [filteredOptions, handleSelect, fieldName])

    const handleInputChange = (_event, newInputValue) => {
        !!inputValueHandler && inputValueHandler(newInputValue)
        setInputValue(newInputValue) // Update input value
    }

    return (
        <React.Fragment>
            <FormControl style={{minWidth: fieldWidth, marginBottom: 0, marginRight: 4}}
                         size={size === 'small' ? 'small' : 'medium'}
                         fullWidth>
                <Autocomplete
                    disabled={noMoreOptions}
                    key={reset || noMoreOptions}
                    selectOnFocus
                    clearOnEscape
                    handleHomeEndKeys
                    autoHighlight
                    size={size === 'small' ? 'small' : 'medium'}
                    fullWidth
                    style={selectStyle}
                    options={filteredOptions}
                    name={fieldName}
                    value={displayValueText || null}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={handleChange}
                    inputValue={String(inputValue)}
                    onInputChange={handleInputChange}
                    getOptionLabel={(option) => (filterValueNames && filterValueNames[option]) ? filterValueNames[option] : option}
                    renderOption={(props, option) => {
                        const count = (counts && counts[option]) ? counts[option] : 0
                        const isText = typeof option === 'string' && ['AND', 'OR'].some(term => option.includes(term))
                        return (
                            <li {...props} key={`${option}-${count}`}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{
                                        maxWidth: 160,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {(filterValueNames && filterValueNames[option]) ? filterValueNames[option] : option}
                                    </div>
                                    <div style={{fontSize: '0.8rem', marginLeft: 8, opacity: 0.85}}>
                                        {(noMoreOptions || isText) ? '' : count}
                                    </div>
                                </div>
                            </li>
                        )
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            placeholder={label}
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
                    noOptionsText={noOptionsText}
                />
                <Backdrop
                    invisible
                    open={open && isMobile}
                    onClick={handleBlur}
                />
            </FormControl>
        </React.Fragment>
    )
}
