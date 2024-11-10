import React, {useCallback, useContext, useState} from 'react'
import Badge from '@mui/material/Badge'
import SortIcon from '@mui/icons-material/Sort'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import FilterContext from '../context/FilterContext'

function SortButton({sortValues, text}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {filters, addFilter} = useContext(FilterContext)
    const {sort} = filters

    const handleClick = useCallback(value => () => {
        handleClose()
        setTimeout(() => addFilter('sort', value, true), 0)
    }, [addFilter, handleClose])

    const display = text ? <div style={{fontSize:'0.9rem', fontWeight:700, marginRight:10}}>SORT</div> : <SortIcon/>
    const badgeAnchor = text
        ? {vertical: 'top', horizontal: 'right'}
        : {vertical: 'bottom', horizontal: 'right'}

    return (
        <React.Fragment>
            <Tooltip title='Sort' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen}>
                    <Badge
                        variant='dot'
                        color='secondary'
                        overlap='circular'
                        invisible={!sort}
                        anchorOrigin={badgeAnchor}
                    >
                        {display}
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {sortValues.map(({label, value}) =>
                    <MenuItem
                        key={label}
                        onClick={handleClick(value)}
                        selected={sort === value}
                    >
                        {label}
                    </MenuItem>
                )}
            </Menu>
        </React.Fragment>
    )
}

export default SortButton
