import React, {useCallback, useState} from 'react'
import Chip from '@mui/material/Chip'
import SettingsIcon from '@mui/icons-material/Settings'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

export default function FilterChipExclude({label, negative, onToggle, onDelete}) {
    const [open, setOpen] = useState(false)

    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback((event) => {
        event.stopPropagation()
        setOpen(event.currentTarget)
    }, [])

    const handleExcludeFilter = useCallback(() => {
        onToggle && onToggle()
        setOpen(false)
    }, [onToggle])

    const handleDeleteFilter = useCallback(() => {
        onDelete && onDelete()
    }, [onDelete])

    const menuText = negative ? 'Show Only Matches' : 'Exclude Matches'
    const bgColor = negative ? '#642c2c' : 'inherit'

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
                    <MenuItem onClick={handleExcludeFilter}>{menuText}</MenuItem>
                    <MenuItem onClick={handleDeleteFilter}>
                        Delete Filter
                    </MenuItem>
                </Menu>
            }
        </React.Fragment>
    )
}
