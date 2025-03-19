import Backdrop from '@mui/material/Backdrop'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useWindowSize from '../util/useWindowSize'
import entryName from '../entries/entryName'
import {beltSort} from '../data/belts'

function LockEntrySearchBox({handleChangeLock, allEntries, disabled, reset=false}) {
    const style = {maxWidth: 700}
    const {isMobile} = useWindowSize()
    const inputEl = useRef()

    const lockDetails = useMemo(() => {
        let lockIds = {}
        let lockNames = {}

        const allLocks = allEntries?.sort((a, b) => {
            beltSort(a.belt, b.belt) || entryName(a, 'short').localeCompare(entryName(b, 'short'))
        })
            .reduce((acc, entry) => {
                const versionText = entry.version ? ' - ' + entry.version : ''
                entry.makeModels.map(lock => {
                    const make = lock.make ? lock.make : lock.model
                    const model = lock.make ? ` ${lock.model}` : ''
                    const lockName = `${make}${model}${versionText}`
                    acc.push({id: entry.id, lockName: lockName, make: make, model: model})
                })
                return acc
            },[])
            .filter(x => x)

        return {allLocks, lockIds, lockNames}

    }, [allEntries])

    const {allLocks, lockIds, lockNames} = lockDetails
    const duplicateLocks = allLocks.filter((lock, index) => allLocks.findIndex(l => l.lockName === lock.lockName) !== index)

    const options = allLocks?.map(lock => {
            lock.lockName = duplicateLocks.find(dupe => dupe.lockName === lock.lockName)
                ? lock.lockName + ` (${allEntries.find(entry => entry.id === lock.id).belt})`
                : lock.lockName
            return lock
        })
        .map((lock) => {
            lockIds[lock.lockName] = lock.id
            lockNames[lock.lockName] = `${lock.make}${lock.model}`
            return lock.lockName
        })

    const handleChange = useCallback((event, value) => {
        if (!value) {
            handleChangeLock({})
        } else if (options.includes(value)) {
            handleChangeLock({
                lockFullName: value,
                lockName: lockNames[value],
                lockId: lockIds[value],
            })
        }
    }, [lockIds, lockNames, options, handleChangeLock])

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
            />
            <Backdrop
                invisible
                open={open && isMobile}
                onClick={handleBlur}
            />
        </React.Fragment>
    )
}

export default LockEntrySearchBox
