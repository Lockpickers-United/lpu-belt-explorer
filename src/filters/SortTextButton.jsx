import React, {useCallback, useContext, useState} from 'react'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import FilterContext from '../context/FilterContext'
import Divider from '@mui/material/Divider'
import LockListContext from '../locks/LockListContext.jsx'
import Button from '@mui/material/Button'
import AppContext from '../app/AppContext.jsx'

function SortTextButton({sortValues}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {filters, addFilter} = useContext(FilterContext)
    const {sort} = filters

    const {compact, setCompact} = useContext(AppContext)

    const handleCompactClick = useCallback(value => () => {
        handleClose()
        setCompact(value)
    }, [handleClose, setCompact])

    const handleClick = useCallback(value => () => {
        handleClose()
        setTimeout(() => addFilter('sort', value, true), 0)
    }, [addFilter, handleClose])

    const badgeAnchor = {vertical: 'top', horizontal: 'right'}

    return (
        <React.Fragment>
            <Tooltip title='View Options' arrow disableFocusListener>
                <Button color='inherit' onClick={handleOpen} style={{color:'#ddd'}}>
                    <Badge
                        variant='dot'
                        color='secondary'
                        invisible={!sort}
                        anchorOrigin={badgeAnchor}
                    >
                        VIEW
                    </Badge>
                </Button>
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

export default SortTextButton
