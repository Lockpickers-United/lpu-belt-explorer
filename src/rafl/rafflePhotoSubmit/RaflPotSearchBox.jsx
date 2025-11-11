import Backdrop from '@mui/material/Backdrop'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useWindowSize from '../../util/useWindowSize'

function RaflPotSearchBox({handleChangeLock, allEntries=[], disabled, reset = false}) {
    const style = {maxWidth: 700}
    const {isMobile} = useWindowSize()
    const inputEl = useRef()

    const lockDetails = useMemo(() => {
        let lockNames = {}
        const allLocks = [...allEntries].sort((a, b) => {
            a.title.localeCompare(b.title)
        }).reduce((acc, entry) => {
            const lockName = `${entry.contributedBy.join(', ')} - ${entry.title}`
            acc.push({id: entry.id, lockName: lockName})
            lockNames[lockName] = lockName
            return acc
        }, []).filter(x => x)
        return {allLocks, lockNames}
    }, [allEntries])

    const {allLocks, lockNames} = lockDetails


    const options = allLocks
        .sort((a, b) => a.lockName.localeCompare(b.lockName))
        .map((lock) => {
            return {label: lock.lockName, id: lock.id}
        })

    const handleChange = useCallback((_event, value) => {
        if (!value) {
            handleChangeLock({})
        } else {
            handleChangeLock({
                lockFullName: value.label,
                lockName: lockNames[value.label],
                lockId: value.id
            })
        }
    }, [lockNames, handleChangeLock])

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
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder='Search Locks'
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
                            key={key}
                            {...optionProps}
                            style={{
                                ...props.style, height: 34, padding: 0, overflow: 'elipsis', whiteSpace: 'nowrap',
                                color: option.belt === 'Unranked' ? '#aaa' : '#fff', fontSize: '0.95rem', marginLeft: 10
                            }}
                        >
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

export default RaflPotSearchBox
