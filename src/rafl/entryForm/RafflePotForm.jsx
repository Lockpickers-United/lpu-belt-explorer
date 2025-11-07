import React, {useCallback, useContext, useEffect, useMemo, useRef, useState, memo} from 'react'
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

function RafflePotForm({questionStyle, index, potData, handlePotChange, showIssues, removePot}) {
    const {allPots} = useContext(RaffleContext)
    const {isMobile, flexStyle} = useWindowSize()
    const isMobileFalse = false
    const style = {maxWidth: 700}
    const inputEl = useRef()

    const [potDetails, setPotDetails] = useState(potData[index])

    const showDelete = (potData || []).length > 1

    useEffect(() => {
        handlePotChange(index, potDetails)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, potDetails])

    // Sync local state when parent potData updates externally (e.g., Auto allocation)
    useEffect(() => {
        const incoming = (potData || [])[index] || {}
        // shallow compare to avoid unnecessary state updates
        const same = (
            (incoming.itemFullTitle === potDetails?.itemFullTitle) &&
            (incoming.itemTitle === potDetails?.itemTitle) &&
            (incoming.itemId === potDetails?.itemId) &&
            (incoming.itemPotNumber === potDetails?.itemPotNumber) &&
            (incoming.itemIndex === potDetails?.itemIndex) &&
            (String(incoming.tickets || '') === String(potDetails?.tickets || ''))
        )
        if (!same) {
            setPotDetails(prev => ({...prev, ...incoming}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, potData])

    const itemMap = useMemo(() => {
        let options = []
        let itemIds = {}
        let itemTitles = {}
        let itemPotNumbers = {}
        let itemFormIds = {}

        allPots
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
        const tickets = parseInt(event.target.value.replace(/[^0-9]/, ''))
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

    const divider = (potData || []).length > 1
        ? <div style={{height: 0, margin: '20px 0px', borderBottom: '2px solid #bbb', alignItems: 'center'}}/>
        : null

    return (
        <div>
            {divider}

            <div style={{display: flexStyle, margin: 12}}>
                <div style={{flexGrow: 1, marginRight: 40, height: 100, minWidth: 280}}>
                    <div style={{...questionStyle, fontWeight: 600, fontSize:'1.1rem'}}>Selected Pot</div>
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
                                value={potDetails.itemFullTitle || null}
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
                                   value={potDetails.tickets ? potDetails.tickets : ''}
                                   error={showIssues && !potDetails.tickets}
                                   helperText={showIssues && !potDetails.tickets ? 'Required Field' : ' '}
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
        </div>

    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.index !== nextProps.index) return false
    if ((prevProps.potData || []).length !== (nextProps.potData || []).length) return false
    if ((prevProps.potData || [])[prevProps.index] !== (nextProps.potData || [])[nextProps.index]) return false
    if (prevProps.showIssues !== nextProps.showIssues) return false
    return prevProps.questionStyle === nextProps.questionStyle
}

export default memo(RafflePotForm, areEqual)