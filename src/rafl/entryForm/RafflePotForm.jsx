import React, {useCallback, useContext, useMemo, useRef, useState} from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import useWindowSize from '../../util/useWindowSize.jsx'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import Backdrop from '@mui/material/Backdrop'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import RaffleContext from '../RaffleContext.jsx'

export default function RafflePotForm({questionStyle, index, potData, handlePotChange, showIssues, removePot}) {
    const allPots = useContext(RaffleContext)
    const {isMobile, flexStyle} = useWindowSize()
    const isMobileFalse = false
    const style = {maxWidth: 700}
    const inputEl = useRef()

    const [potDetails, setPotDetails] = useState(potData[index])

    const showDelete = Array.from(Object.keys(potData)).length > 1

    if ((potData[index].tickets !== potDetails.tickets) || potData[index].itemFullTitle !== potDetails.itemFullTitle) {
        const complete = (!!potDetails.itemFullTitle && !!potDetails.tickets)
        handlePotChange(index, potDetails, complete)
    }

    const itemMap = useMemo(() => {
        let options = []
        let itemIds = {}
        let itemTitles = {}
        let itemPotNumbers = {}
        let itemFormIds = {}

        allPots.allPots
            .filter(item => item.formId > 0)
            .sort((a, b) => {
                return parseInt(a.potNumber) - parseInt(b.potNumber)
                || a.title.localeCompare(b.title)
            })
            .map((item) => {
                const fullTitle = `Pot ${item.potNumber} - ${item.title}`
                itemTitles[fullTitle] = item.title
                itemIds[fullTitle] = item.id
                itemPotNumbers[fullTitle] = item.potNumber
                options.push(fullTitle)
            })
            .filter(x => x)
        return {options, itemIds, itemTitles, itemPotNumbers, itemFormIds}
    }, [allPots])

    const {options, itemIds, itemTitles, itemPotNumbers} = itemMap

    const handleTicketsChange = useCallback(event => {
        const tickets = event.target.value.replace(/[^0-9]/, '')
        const tempPotDetails = {...potDetails, tickets: tickets}
        setPotDetails(tempPotDetails)
    }, [potDetails])

    const handlePotChoiceChange = useCallback((_event, value) => {
        let item
        if (options.includes(value)) {
            item = {
                itemFullTitle: value,
                itemTitle: itemTitles[value],
                itemId: itemIds[value],
                itemPotNumber: itemPotNumbers[value],
                itemIndex: options.indexOf(value)
            }
        } else {
            item = {}
        }
        setPotDetails({...potDetails, ...item})
    }, [options, potDetails, itemTitles, itemIds, itemPotNumbers])

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
            <div style={{flexGrow: 1, marginRight: 40, height: 100, minWidth: 280}}>
                <div style={{...questionStyle}}>Selected Pot</div>
                <div style={{height: 4}}/>
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
                <div style={{
                    fontSize: '0.75rem',
                    color: '#f44336',
                    margin: '4px 14px 0px 14px',
                    display: showIssues && !potDetails.itemFullTitle ? 'block' : 'none'
                }}>
                    Required Field
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={{flexGrow: 1}}></div>

                <FormControl>
                    {!isMobile && <div style={questionStyle}>&nbsp;</div>}
                    <TextField type='text' name='tickets' label='Tickets'
                               value={potData[index].tickets ? potData[index].tickets : ''}
                               error={showIssues && !potDetails.tickets}
                               helperText={showIssues && !potData[index].tickets ? 'Required Field' : ' '}
                               onChange={handleTicketsChange} color='info' size='small'
                               style={{width: 120}}/>
                </FormControl>
                {showDelete &&

                    <div style={{marginLeft: 10}}>
                        {!isMobile && <div style={questionStyle}>&nbsp;</div>}
                        <IconButton color='warning' onClick={() => removePot(index)}>
                            <DeleteForeverIcon/>
                        </IconButton>
                    </div>
                }
            </div>

        </div>
    )
}