import React, {useCallback, useState} from 'react'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'

export default function SelectBox({form, name, optionsList, label=null, variant='outlined', size='small', width=350, changeHandler, multiple=false, defaultValue, placeholder='Please Choose'}) {
    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleChange = useCallback(event => {
        changeHandler(event)
        !multiple && handleClose()
    }, [changeHandler, handleClose, multiple])

    return (
        <FormControl id={`${name}FormControl`} size={size} color='info' variant={variant} style={{marginBottom: 0, width: width || 'auto' }}>
            {label && <InputLabel style={{color: '#bbb'}}>{label}</InputLabel>}
            <Select
                id={`${name}Select`}
                value={form[name] || defaultValue}
                multiple={multiple}
                name={name}
                label={label}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
                placeholder={placeholder}
                style={{
                    fontWeight: 400,
                    color: '#eee',
                    fontSize: '1.1rem'
                }}
            >
                {optionsList.map((_option, index) =>
                    <MenuItem key={index}
                              value={optionsList[index]}>{optionsList[index]}</MenuItem>
                )}
            </Select>
        </FormControl>
    )

}
