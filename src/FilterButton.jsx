import {Box, Container, DialogActions, SwipeableDrawer, Tooltip} from '@mui/material'
import React, {useCallback, useContext, useState} from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt.js'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import FilterContext from './FilterContext.jsx'
import filterFields from './data/filterFields.js'
import FilterByField from './FilterByField.jsx'
import Stack from '@mui/material/Stack'
import ClearFiltersButton from './ClearFiltersButton.jsx'

function FilterButton({data, tab, onChangeTab}) {
    const [open, setOpen] = useState(false)

    const openDialog = useCallback(() => setOpen(true), [])
    const closeDialog = useCallback(() => setOpen(false), [])

    const {filterCount, addFilter} = useContext(FilterContext)

    const handleAddFilter = (keyToAdd, valueToAdd) => {
        setTimeout(() => {
            addFilter(keyToAdd, valueToAdd)
            if (tab !== 'search') onChangeTab('search')
        }, 0)
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
                    <IconButton color='inherit' onClick={openDialog}>
                        <FilterAltIcon/>
                    </IconButton>
                </Badge>
            </Tooltip>

            <SwipeableDrawer
                anchor='right'
                open={open}
                onClose={closeDialog}
            >
                <Box margin={1}>
                    <Stack direction='column' style={{marginTop: 8, minWidth: 250}}>
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
                    <DialogActions>
                        <ClearFiltersButton
                            tab={tab}
                            onChangeTab={onChangeTab}
                        />
                    </DialogActions>
                </Box>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default FilterButton
