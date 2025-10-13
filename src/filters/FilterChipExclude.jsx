import React, {useCallback, useContext, useState} from 'react'
import Chip from '@mui/material/Chip'
import FilterContext from '../context/FilterContext.jsx'
import SettingsIcon from '@mui/icons-material/Settings'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

export default function FilterChipExclude({filterKey, filterValue, label}) {

    const {removeFilter, addFilter} = useContext(FilterContext)
    const [open, setOpen] = useState(false)

    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback((event) => {
        event.stopPropagation()
        setOpen(event.currentTarget)
    }, [])

    const handleExcludeFilter = useCallback((keyToToggle, valueToToggle) => () => {
        const str = String(valueToToggle ?? '')
        const newValue = str.startsWith('!') ? str.slice(1) : '!' + str
        removeFilter(keyToToggle, valueToToggle)
        addFilter(keyToToggle, newValue)
        setOpen(false)
    }, [addFilter, removeFilter])

    const handleDeleteFilter = useCallback((keyToDelete, valueToDelete) => () => {
        removeFilter(keyToDelete, valueToDelete)
    }, [removeFilter])

    const menuText = filterValue.startsWith('!') ? 'Show Only Matches' : 'Exclude Matches'
    const bgColor = filterValue.startsWith('!') ? '#642c2c' : 'inherit'

    return (
        <React.Fragment>
            <Chip
                label={label
                    .replace('!', 'NOT ').replace('||', ' OR ').replace('@@', ' AND ')}
                variant='outlined'
                style={{marginRight: 4, marginBottom: 4, backgroundColor: bgColor}}
                onDelete={handleOpen}
                deleteIcon={<SettingsIcon/>}
            />
            {!!open &&
                <Menu
                    open={!!open}
                    anchorEl={open}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleExcludeFilter(filterKey, filterValue)}>{menuText}</MenuItem>
                    <MenuItem onClick={handleDeleteFilter(filterKey, filterValue)}>
                        Delete Filter
                    </MenuItem>
                </Menu>
            }
        </React.Fragment>
    )
}


