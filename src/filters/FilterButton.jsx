import {Box, SwipeableDrawer, Tooltip} from '@mui/material'
import React, {useCallback, useContext, useState} from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt.js'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import FilterContext from '../contexts/FilterContext.jsx'
import filterFields from '../data/filterFields.js'
import FilterByField from './FilterByField.jsx'
import Stack from '@mui/material/Stack'
import ClearFiltersButton from './ClearFiltersButton.jsx'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AppContext from '../contexts/AppContext.jsx'
import {useHotkeys} from 'react-hotkeys-hook'

function FilterButton({data}) {
    const {tab, setTab} = useContext(AppContext)
    const [open, setOpen] = useState(false)
    useHotkeys('f', () => setOpen(true))

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
                <Badge
                    badgeContent={filterCount}
                    color='secondary'
                    overlap='circular'
                    anchorOrigin={{
                        vertical: 'bottom', horizontal: 'right'
                    }}
                >
                    <IconButton color='inherit' onClick={openDrawer} edge='end'>
                        <FilterAltIcon/>
                    </IconButton>
                </Badge>
            </Tooltip>

            <SwipeableDrawer
                anchor='right'
                open={open}
                onOpen={openDrawer}
                onClose={closeDrawer}
            >
                <Toolbar variant='dense'>
                    <Typography variant="h6">Filters</Typography>
                </Toolbar>
                <Box margin={1}>
                    <Stack direction='column' style={{minWidth: 250}}>
                        {filterFields.map(({label, fieldName, values}, index) =>
                            <FilterByField
                                data={data}
                                key={index}
                                label={label}
                                fieldName={fieldName}
                                values={values}
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
