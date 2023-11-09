import React, {useCallback, useContext, useState} from 'react'
import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Tooltip from '@mui/material/Tooltip'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import FilterContext from '../contexts/FilterContext'
import filterFields from '../data/filterFields'
import FilterByField from './FilterByField'
import Stack from '@mui/material/Stack'
import ClearFiltersButton from './ClearFiltersButton'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AppContext from '../contexts/AppContext'
import {useHotkeys} from 'react-hotkeys-hook'

function FilterButton({data}) {
    const {beta, tab, setTab} = useContext(AppContext)
    const [open, setOpen] = useState(false)
    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('f', handleHotkey)

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    const {filterCount, addFilter} = useContext(FilterContext)

    const handleAddFilter = (keyToAdd, valueToAdd) => {
        if (tab !== 'search') setTab('search')
        setTimeout(() => addFilter(keyToAdd, valueToAdd, true), 0)
    }

    return (
        <React.Fragment>
            <Tooltip title='Filter' arrow disableFocusListener>
                <IconButton color='inherit' onClick={openDrawer} edge={beta ? null : 'end'}>
                    <Badge
                        badgeContent={filterCount}
                        color='secondary'
                        overlap='circular'
                        anchorOrigin={{
                            vertical: 'bottom', horizontal: 'right'
                        }}
                    >
                        <FilterAltIcon/>
                    </Badge>
                </IconButton>
            </Tooltip>

            <SwipeableDrawer
                anchor='right'
                open={open}
                onOpen={openDrawer}
                onClose={closeDrawer}
            >
                <Toolbar variant='dense'>
                    <Typography variant='h6'>Filters</Typography>
                </Toolbar>
                <Box margin={1}>
                    <Stack direction='column' style={{minWidth: 250}}>
                        {filterFields.map((field, index) =>
                            <FilterByField
                                data={data}
                                key={index}
                                {...field}
                                onFilter={handleAddFilter}
                            />
                        )}
                    </Stack>
                </Box>
                <Toolbar variant='dense'>
                    <ClearFiltersButton style={{marginRight: 8}}/>
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={closeDrawer}
                    >
                        Done
                    </Button>
                </Toolbar>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default FilterButton
