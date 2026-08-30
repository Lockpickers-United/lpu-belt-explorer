import Backdrop from '@mui/material/Backdrop'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useWindowSize from '../util/useWindowSize.jsx'
import entryName from '../entries/entryName'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'

export default function ScorecardEntrySearchBox({
                                                    handleChangeScorecardEntry,
                                                    scorecardEntries = [],
                                                    disabled,
                                                    reset = false,
                                                }) {
    const style = {maxWidth: 700}
    const {isMobile} = useWindowSize()
    const inputEl = useRef()

    const lockDetails = useMemo(() => {
        let lockNames = {}

        return scorecardEntries.reduce((acc, entry) => {
            lockNames[entryName(entry, 'short')] = entryName(entry, 'long', {includeVersion: true})
            acc.push({
                ...entry,
                lockName: entryName(entry, 'short'),
                lockLongName: entryName(entry, 'long', {includeVersion: true})
            })
            return acc
        }, [])
            .filter(x => x)

    }, [scorecardEntries])

    const duplicateLocks = lockDetails.filter((lock, index) => lockDetails.findIndex(l => l.lockName === lock.lockName) !== index)

    const options = lockDetails?.map(lock => {
        const {id, matchId, belt, link} = lock
        const lockName = (duplicateLocks.find(dupe => dupe.lockName === lock.lockName)) && !lock.lockName.match(/\(\w+\)/)
            ? lock.lockName + ` (${lock.belt})`
            : lock.lockName

        return {label: lockName, id, matchId, lockName, belt, link}
    })

    const handleChange = useCallback((_event, value) => {
        if (!value) {
            handleChangeScorecardEntry(null)
        } else {
            handleChangeScorecardEntry(value)
        }
    }, [handleChangeScorecardEntry])

    const [open, setOpen] = useState(false)
    const handleBlur = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Autocomplete
                disabled={disabled}
                key={reset || disabled}
                selectOnFocus
                clearOnEscape
                handleHomeEndKeys
                fullWidth
                style={style}
                options={options}
                onChange={handleChange}
                onInputChange={handleChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder='Search Scorecard'
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
                isOptionEqualToValue={(option, value) => option.label === value.label}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => {
                    const {key, ...optionProps} = props
                    return (
                        <div
                            key={option.label + option.id}
                            {...optionProps}
                            style={{
                                ...props.style, height: 34, padding: 0, overflow: 'elipsis', whiteSpace: 'nowrap',
                                color: option.belt === 'Unranked' ? '#aaa' : '#fff', fontSize: '0.95rem'
                            }}
                        >
                            <BeltStripeMini value={option.belt} style={{marginRight: 10}}/>

                            {option.label}

                        </div>
                    )
                }}

            />
            <Backdrop
                invisible
                open={open && isMobile}
                onClick={handleBlur}
            />
        </React.Fragment>
    )
}