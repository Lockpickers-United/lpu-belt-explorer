import React, {useCallback, useState} from 'react'
import Badge from '@mui/material/Badge'
import SortIcon from '@mui/icons-material/Sort'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {useSearchParams} from 'react-router-dom'

function LeaderboardSortButton() {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const [searchParams, setSearchParams] = useSearchParams()
    const sort = searchParams.get('sort')

    const handleClick = useCallback(value => () => {
        handleClose()
        if (value && value !== sort) {
            searchParams.set('sort', value)
        } else {
            searchParams.delete('sort')
        }
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams, sort, handleClose])

    return (
        <React.Fragment>
            <Tooltip title='Sort' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen}>
                    <Badge
                        variant='dot'
                        color='secondary'
                        overlap='circular'
                        invisible={!sort}
                        anchorOrigin={{
                            vertical: 'bottom', horizontal: 'right'
                        }}
                    >
                        <SortIcon/>
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

const sortValues = [
    {label: 'Default', value: undefined},
    {label: 'Own', value: 'own'},
    {label: 'Picked', value: 'picked'},
    {label: 'Recorded', value: 'recorded'},
    {label: 'Wishlist', value: 'wishlist'}
]

export default LeaderboardSortButton
