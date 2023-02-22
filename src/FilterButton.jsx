import {Box, SwipeableDrawer, Tooltip} from '@mui/material'
import React, {useCallback, useContext, useState} from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt.js'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import FilterContext from './FilterContext.jsx'
import filterFields from './data/filterFields.js'
import FilterByField from './FilterByField.jsx'
import Stack from '@mui/material/Stack'
import ClearFiltersButton from './ClearFiltersButton.jsx'
import Toolbar from '@mui/material/Toolbar'
import FieldValue from './FieldValue'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

function FilterButton({data, tab, onChangeTab}) {
    const [open, setOpen] = useState(false)

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    const {filterCount, addFilter} = useContext(FilterContext)

    const handleAddFilter = (keyToAdd, valueToAdd) => {
        if (tab !== 'search') onChangeTab('search')
        setTimeout(() => addFilter(keyToAdd, valueToAdd, true), 0)
    }

    return (
        <React.Fragment>
            <Tooltip title='Filter'>
                <Badge
                    badgeContent={filterCount}
                    color='secondary'
                    overlap='circular'
                    anchorOrigin={{
                        vertical: 'bottom', horizontal: 'right'
                    }}
                >
                    <IconButton color='inherit' onClick={openDrawer}>
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
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={closeDrawer}
                        style={{marginRight: 8}}
                    >
                        Close
                    </Button>
                    <ClearFiltersButton
                        tab={tab}
                        onChangeTab={onChangeTab}
                    />
                </Toolbar>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default FilterButton
