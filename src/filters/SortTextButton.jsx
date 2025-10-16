import React, {useCallback, useContext, useState} from 'react'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import FilterContext from '../context/FilterContext'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import AppContext from '../app/AppContext.jsx'
import ExpandAllButton from '../rafl/ExpandAllButton.jsx'
import DBContext from '../app/DBContext.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import SortIcon from '@mui/icons-material/Sort'

function SortTextButton({sortValues, compactMode, expandAll}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {filters, addFilter} = useContext(FilterContext)
    const {sort} = filters
    const {adminRole} = useContext(DBContext)

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

    const {width} = useWindowSize()
    const smallWidth = width <= 500

    return (
        <React.Fragment>
            <Tooltip title='View Options' arrow disableFocusListener>
                <Button color='inherit' onClick={handleOpen} style={{color: '#ddd'}}>
                    <Badge
                        variant='dot'
                        color='secondary'
                        invisible={!sort}
                        anchorOrigin={badgeAnchor}
                    >
                        {!smallWidth ? 'VIEW' : <SortIcon/>}
                    </Badge>
                </Button>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}

                MenuListProps={{
                    'aria-label': 'View and Sort Options'
                }}

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

                {compactMode &&
                    <div>
                        <Divider/>
                        <div style={{marginLeft: 5, marginTop: 5, padding: 5, fontWeight: 700}}>MODE</div>
                        <MenuItem onClick={handleCompactClick(false)} selected={!compact}>Normal</MenuItem>
                        <MenuItem onClick={handleCompactClick(true)} selected={compact}>Compact</MenuItem>
                    </div>
                }

                {adminRole && expandAll &&
                    <div>
                        <Divider/>
                        <ExpandAllButton text={true}/>
                    </div>
                }

            </Menu>
        </React.Fragment>
    )
}

export default SortTextButton
