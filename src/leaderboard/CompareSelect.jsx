import React, {useCallback, useState} from 'react'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import useWindowSize from '../util/useWindowSize.jsx'
import {useSearchParams} from 'react-router-dom'

function CompareSelect({blackBeltData, fighter, label, param}) {
    const [searchParams, setSearchParams] = useSearchParams()

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleChange = useCallback(event => {
        searchParams.set(param, event.target.value.id)
        setSearchParams(searchParams)
        handleClose()
    }, [handleClose, param, searchParams, setSearchParams])

    const {isMobile} = useWindowSize()
    const minWidth = !isMobile ? 220 : 150

    return (
        <FormControl style={{marginBottom: 10, minWidth: minWidth, textAlign: 'left'}} size='small'>
            <InputLabel color='info'>{label}</InputLabel>
            <Select
                value={fighter}
                name='fighter'
                label={label}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
                style={{fontWeight: 400, color: '#eee'}}
                color='info'
            >
                {blackBeltData.map((blackbelt, index) =>
                    <MenuItem key={index} value={blackbelt}>{blackbelt.displayName}</MenuItem>
                )}
            </Select>
        </FormControl>
    )
}

export default CompareSelect