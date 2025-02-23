import Backdrop from '@mui/material/Backdrop'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useWindowSize from '../util/useWindowSize'
import entryName from '../entries/entryName'
import {beltSort} from '../data/belts'

function LockEntrySearchBox({handleChangeLock, allEntries, disabled}) {
    const style = {maxWidth: 700}
    const {isMobile} = useWindowSize()
    const inputEl = useRef()

    const lockDetails = useMemo(() => {
        let options = []
        let lockIds = {}
        let lockNames = {}
        let lockSamelines = {}
        let entryMaxSamelines = {}

        allEntries?.sort((a, b) => {
            beltSort(a.belt, b.belt) || entryName(a, 'short').localeCompare(entryName(b, 'short'))
        })
            .map(entry => {
                const versionText = entry.version ? ' - ' + entry.version : ''
                entry.makeModels.map((lock, index) => {
                    const make = lock.make ? lock.make + ' ' : ''
                    const model = lock.model || ''
                    const lockName = `${make}${model}${versionText}`

                    options.push(lockName)
                    lockIds[lockName] = entry.id
                    lockSamelines[lockName] = index + 1
                    lockNames[lockName] = `${make}${model}`
                    entryMaxSamelines[entry.id] = entryMaxSamelines[entry.id]
                        ? Math.max(index + 1, entryMaxSamelines[entry.id])
                        : index + 1
                })
            })
            .filter(x => x)

        //options.unshift(' ')

        return {options, lockIds, lockNames, lockSamelines, entryMaxSamelines}

    }, [allEntries])

    const {options, lockIds, lockNames, lockSamelines, entryMaxSamelines} = lockDetails

    const lockMaxSamelines = options.reduce((acc,lockName) => {
        const foo = lockIds[lockName]
        acc[lockName] = entryMaxSamelines[foo]
        return acc
    },{})

    const handleChange = useCallback((event, value) => {
        if (!value) {
            handleChangeLock({})
        } else if (options.includes(value)) {
            handleChangeLock({
                lockFullName: value,
                lockName: lockNames[value],
                lockId: lockIds[value],
                lockSameline: lockSamelines[value],
                lockMaxSameline: lockMaxSamelines[value]
            })
        }
    }, [lockIds, lockMaxSamelines, lockNames, lockSamelines, options, handleChangeLock])

    const [open, setOpen] = useState(false)
    const handleBlur = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Autocomplete
                disabled={disabled}
                key={disabled}
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
