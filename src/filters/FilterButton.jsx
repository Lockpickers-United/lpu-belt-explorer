import React, {useCallback, useContext, useState} from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Tooltip from '@mui/material/Tooltip'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import AuthContext from '../app/AuthContext'
import FilterContext from '../context/FilterContext'
import FilterByField from './FilterByField'
import Stack from '@mui/material/Stack'
import ClearFiltersButton from './ClearFiltersButton'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AppContext from '../app/AppContext'
import {useHotkeys} from 'react-hotkeys-hook'

function FilterButton({onFiltersChanged, extraFilters = [], text}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {beta} = useContext(AppContext)
    const {filterCount, addFilters, filterFields} = useContext(FilterContext)
    const [open, setOpen] = useState(false)
    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('f', handleHotkey)

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    const handleAddFilter = useCallback((keyToAdd, valueToAdd) => {
        addFilters([
            {key: keyToAdd, value: valueToAdd},
            {key: 'id', value: undefined},
            {key: 'name', value: undefined},
            ...extraFilters
        ], true)
        onFiltersChanged && onFiltersChanged()
    }, [addFilters, onFiltersChanged, extraFilters])

    const display = text ? <div style={{fontSize:'0.9rem', fontWeight:700, marginRight:10}}>FILTER</div> : <FilterAltIcon/>
    const badgeAnchor = text
        ? {vertical: 'top', horizontal: 'right'}
        : {vertical: 'bottom', horizontal: 'right'}
    const badgeVariant = text ? 'dot' : null


    return (
        <React.Fragment>
            <Tooltip title='Filter' arrow disableFocusListener>
                <IconButton color='inherit' onClick={openDrawer}>
                    <Badge
                        variant={badgeVariant}
                        badgeContent={filterCount}
                        color='secondary'
                        overlap='circular'
                        anchorOrigin={badgeAnchor}
                    >
                        {display}
                    </Badge>
                </IconButton>
            </Tooltip>

            <Drawer
                anchor='right'
                open={open}
                onClose={closeDrawer}
            >
                <Toolbar variant='dense' onClick={closeDrawer}>
                    <Typography variant='h6'>Filters</Typography>
                </Toolbar>
                <Box margin={1}>
                    <Stack direction='column' style={{minWidth: 250}}>
                        {filterFields
                            .filter(field => {
                                return (!field.beta || beta) && (!field.userBased || isLoggedIn)
                            })
                            .map((field, index) =>
                                <FilterByField
                                    key={index}
                                    {...field}
                                    onFilter={handleAddFilter}
                                />
                            )}
                    </Stack>
                </Box>
                <Toolbar variant='dense'>
                    <ClearFiltersButton forceText style={{marginRight: 8}}/>
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={closeDrawer}
                    >
                        Done
                    </Button>
                </Toolbar>
            </Drawer>
        </React.Fragment>
    )
}

export default FilterButton
