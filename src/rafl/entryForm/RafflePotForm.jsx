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

export default function RafflePotForm({questionStyle, index, potData, handlePotChange}) {
    const {isMobile, flexStyle} = useWindowSize()
    const style = {maxWidth: 700}
    const inputEl = useRef()

    const [potDetails, setPotDetails] = useState({})

    if ( potData[index] && (potData[index].donation !== potDetails.donation || potData[index].itemFullTitle !== potDetails.itemFullTitle)) {
        console.log('change detected')
        handlePotChange(index, potDetails)
    }

    const potFullTitle = useCallback((pot) => {
        return `Pot ${pot.potNumber} - ${pot.title}`
    }, [])

    const itemMap = useMemo(() => {
        let options = []
        let itemIds = {}
        let itemTitles = {}
        let itemPotNumbers = {}
        allItems?.sort((a, b) => {
            a.title.localeCompare(b.title)
        })
            .map(item => {
                const fullTitle = potFullTitle(item)
                itemTitles[fullTitle] = item.title
                itemIds[fullTitle] = item.id
                itemPotNumbers[fullTitle] = item.potNumber
                options.push(fullTitle)
            })
            .filter(x => x)
        return {options, itemIds, itemTitles, itemPotNumbers}
    }, [potFullTitle])
    const {options, itemIds, itemTitles, itemPotNumbers} = itemMap

    const handleTicketsChange = useCallback(event => {
        setPotDetails({...potDetails, donation: event.target.value})
        if (!potData[index]) handlePotChange(index, potDetails)
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
        if (!potData[index]) handlePotChange(index, potDetails)
    }, [options, potDetails, potData, index, handlePotChange, itemTitles, itemIds, itemPotNumbers])

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
        <div style={{display: flexStyle, margin: 12}}>
            <div style={{flexGrow: 1, marginRight: 40}}>
                <div style={questionStyle}>Selected Pot</div>
                <div style={{height: 12}}/>

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
                            onChange={handlePotChoiceChange}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
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
                        open={open && isMobile}
                        onClick={handleBlur}
                    />
                </React.Fragment>


            </div>
            <div>
                <div style={{...questionStyle}}>Tickets invested</div>
                <FormControl style={{margin: 8}}>
                    <TextField type='text' name='donation' label='Donation Amount'
                               value={potDetails.donation ? potDetails.donation : ''}
                               onChange={handleTicketsChange} color='info' size='small'/>
                </FormControl>
            </div>
        </div>
    )
}