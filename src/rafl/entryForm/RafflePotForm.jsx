import React, {useCallback, useMemo, useRef, useState} from 'react'
import allItems from '../../data/rafl.json'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import useWindowSize from '../../util/useWindowSize.jsx'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import Backdrop from '@mui/material/Backdrop'

export default function RafflePotForm({questionStyle, index, potData, handlePotChange, showIssues}) {
    const {flexStyle} = useWindowSize()
    const isMobileFalse = false
    const style = {maxWidth: 700}
    const inputEl = useRef()

    const [potDetails, setPotDetails] = useState({})

    if (potData[index] && (potData[index].tickets !== potDetails.tickets || potData[index].itemFullTitle !== potDetails.itemFullTitle)) {
        const complete = (potDetails.itemFullTitle && potDetails.tickets)
        handlePotChange(index, potDetails, complete)
    }

    const itemMap = useMemo(() => {
        let options = []
        let itemIds = {}
        let itemTitles = {}
        let itemPotNumbers = {}
        allItems?.sort((a, b) => {
            a.title.localeCompare(b.title)
        })
            .map(item => {
                const fullTitle = `Pot ${item.potNumber} - ${item.title}`
                itemTitles[fullTitle] = item.title
                itemIds[fullTitle] = item.id
                itemPotNumbers[fullTitle] = item.potNumber
                options.push(fullTitle)
            })
            .filter(x => x)
        return {options, itemIds, itemTitles, itemPotNumbers}
    }, [])
    const {options, itemIds, itemTitles, itemPotNumbers} = itemMap

    const handleTicketsChange = useCallback(event => {
        setPotDetails({...potDetails, tickets: event.target.value.replace(/[^0-9]/, '')})
        if (!potData[index]) handlePotChange(index, potDetails, false)
    }, [handlePotChange, index, potData, potDetails])

    const handlePotChoiceChange = useCallback((event, value) => {
        let item
        if (options.includes(value)) {
            item = {
                itemFullTitle: value,
                itemTitle: itemTitles[value],
                itemId: itemIds[value],
                itemPotNumber: itemPotNumbers[value]
            }
        } else {
            item = {}
        }
        setPotDetails({...potDetails, ...item})
        if (!potData[index]) handlePotChange(index, potDetails, false)
    }, [options, potDetails, potData, index, handlePotChange, itemTitles, itemIds, itemPotNumbers])

    const [open, setOpen] = useState(false)
    const handleClick = useCallback(() => {
        setOpen(true)
        setTimeout(() => inputEl.current.focus(), 15)
    }, [])
    const handleBlur = useCallback(() => setOpen(false), [])

    const focusStyle = open && isMobileFalse ? {
        width: 'auto',
        position: 'fixed',
        left: 60,
        right: 0,
        paddingRight: 16,
        maxWidth: 'unset',
        zIndex: 9999999,
        backgroundColor: '#272727'
    } : {}

    const errorStyle = showIssues && !potDetails.itemFullTitle ? {borderBottom: '#b00 solid 4px'} : {}

    return (
        <div style={{display: flexStyle, margin: 12}}>
            <div style={{flexGrow: 1, marginRight: 40, height: 100}}>
                <div style={questionStyle}>Selected Pot</div>
                <div style={{height: 6}}/>
                <React.Fragment>
                    {!open && isMobileFalse && <Tooltip title='Search' arrow disableFocusListener>
                        <IconButton color='inherit' onClick={handleClick}>
                            <SearchIcon/>
                        </IconButton>
                    </Tooltip>}
                    {(open || !isMobileFalse) &&
                        <Autocomplete
                            selectOnFocus
                            clearOnEscape
                            handleHomeEndKeys
                            fullWidth
                            style={{...style, ...focusStyle}}
                            options={options}
                            onChange={handlePotChoiceChange}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    style={errorStyle}
                                    placeholder={'Search Pots'}
                                    variant='standard'
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
                        />}
                    <Backdrop
                        invisible
                        open={open && isMobileFalse}
                        onClick={handleBlur}
                    />
                </React.Fragment>
                <div style={{display: showIssues && !potDetails.itemFullTitle ? 'block' : 'none'}}
                     className='MuiFormHelperText-root Mui-error MuiFormHelperText-sizeSmall MuiFormHelperText-contained css-cxf8aw-MuiFormHelperText-root'>
                    Required Field
                </div>


            </div>
            <div style={{justifyContent: 'right'}}>
                <div style={{...questionStyle}}>Tickets invested</div>
                <FormControl>
                    <TextField type='text' name='tickets' label='Tickets'
                               value={potDetails.tickets ? potDetails.tickets : ''}
                               error={showIssues && !potDetails.tickets}
                               helperText={showIssues && !potDetails.tickets ? 'Required Field' : ' '}
                               onChange={handleTicketsChange} color='info' size='small'/>
                </FormControl>
            </div>
        </div>
    )
}