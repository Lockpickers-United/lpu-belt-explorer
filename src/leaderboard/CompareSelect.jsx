import React, {useCallback, useState} from 'react'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'

function CompareSelect({blackBeltData, fighter, setFighter, label}) {

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleChange = useCallback(event => {
        setFighter(event.target.value)
        handleClose()
    }, [handleClose, setFighter])

    return (
        <FormControl style={{marginBottom: 10, minWidth: 200, textAlign: 'left'}} size='small'>
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