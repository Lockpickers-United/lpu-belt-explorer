import React, {useCallback, useState} from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export default function AdvancedSelect({props}) {
    const {
        label,
        size,
        filteredOptions,
        filterValueNames,
        counts,
        fieldName,
        fieldWidth,
        noMoreOptions,
        displayValueText,
        handleSelect,
        selectStyle
    } = props

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => {
        setOpen(false)
        setTimeout(() => document.activeElement.blur())
    }, [])
    const handleOpen = useCallback(() => setOpen(true), [])


    return (
        <FormControl style={{minWidth: fieldWidth, marginBottom: 0, marginRight: 4}}
                     size={size === 'small' ? 'small' : 'medium'}
                     fullWidth>
            <InputLabel id={`filter-${fieldName}`} color='secondary'
                        style={{opacity: noMoreOptions ? 0.5 : 1}}>
                {label}
            </InputLabel>
            <Select
                label={label}
                labelId={`filter-${fieldName}`}
                value={displayValueText}
                disabled={noMoreOptions}
                onChange={handleSelect}
                style={{...selectStyle, opacity: noMoreOptions ? 0.5 : 1}}
                color='secondary'
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                onBlur={handleClose}
            >
                {filteredOptions.map((opt, index) => {
                    const count = counts[opt] || 0
                    const isText = ['AND', 'OR'].some(term => opt.includes(term))

                    return (
                        <MenuItem key={`${opt}-${index}`} value={opt}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    maxWidth: 160,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>{filterValueNames[opt] ? filterValueNames[opt] : opt}</div>
                                <div
                                    style={{fontSize: '0.8rem', marginLeft: 8, opacity: 0.85}}>
                                    {(noMoreOptions || isText) ? '' : count}
                                </div>
                            </div>
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}