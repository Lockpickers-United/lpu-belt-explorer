import React, {useCallback, useContext, useState} from 'react'
import Badge from '@mui/material/Badge'
import SortIcon from '@mui/icons-material/Sort'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import FilterContext from '../context/FilterContext'
import Divider from '@mui/material/Divider'
import LockListContext from '../locks/LockListContext.jsx'

function SortButton({sortValues, text}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {filters, addFilter} = useContext(FilterContext)
    const {sort} = filters

    const {compact, setCompact} = useContext(LockListContext)

    const handleCompactClick = useCallback(value => () => {
        handleClose()
        setCompact(value)
    }, [handleClose, setCompact])

    const handleClick = useCallback(value => () => {
        handleClose()
        setTimeout(() => addFilter('sort', value, true), 0)
    }, [addFilter, handleClose])

    const display = text ? <div style={{fontSize: '0.9rem', fontWeight: 700, marginRight: 10}}>VIEW</div> : <SortIcon/>
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
                <div style={{marginLeft: 5, padding: 5, fontWeight: 700}}>SORT BY</div>
                {sortValues.map(({label, value}) =>
                    <MenuItem
                        key={label}
                        onClick={handleClick(value)}
                        selected={sort === value}
                    >
                        {label}
                    </MenuItem>
                )}

                <Divider/>
                <div style={{marginLeft: 5, padding: 5, fontWeight: 700}}>MODE</div>
                <MenuItem onClick={handleCompactClick(false)} selected={!compact}>Normal</MenuItem>
                <MenuItem onClick={handleCompactClick(true)} selected={compact}>Compact</MenuItem>

            </Menu>
        </React.Fragment>
    )
}

export default SortButton
