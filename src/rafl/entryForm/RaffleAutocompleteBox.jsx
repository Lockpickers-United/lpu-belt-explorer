import Backdrop from '@mui/material/Backdrop'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

function RaffleAutocompleteBox({allItems, setItemDetails, getOptionTitle, searchText, error}) {
    const style = {maxWidth: 700}
    const {isMobile} = false
    const inputEl = useRef()

    const itemMap = useMemo(() => {

        let options = []
        let itemIds = {}
        let itemTitles = {}

        allItems?.sort((a, b) => {
            a.title.localeCompare(b.title)
        })
            .map(item => {
                const fullTitle = getOptionTitle(item)
                itemTitles[fullTitle] = item.title
                itemIds[fullTitle] = item.id
                options.push(fullTitle)
            })
            .filter(x => x)

        return {options, itemIds, itemTitles}

    }, [allItems, getOptionTitle])

    const {options, itemIds, itemTitles} = itemMap

    const handleChange = useCallback((_event, value) => {
        if (!value) {
            setItemDetails({})
        } else if (options.includes(value)) {
            setItemDetails({
                itemFullTitle: value,
                itemTitle: itemTitles[value],
                itemId: itemIds[value],
            })
        }
    }, [options, itemIds, itemTitles, setItemDetails])

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

    const errorStyle = error ? {borderBottom:'#b00 solid 4px'} : {}

    return (
        <React.Fragment>
            {!open && isMobile && <Tooltip title='Search' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleClick}>
                    <SearchIcon/>
                </IconButton>
            </Tooltip>}
            {(open || !isMobile) &&
                <Autocomplete
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
                        placeholder={searchText ? searchText : 'Search'}
                        variant='standard'
                        color='info'
                        style={errorStyle}
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

export default RaffleAutocompleteBox
