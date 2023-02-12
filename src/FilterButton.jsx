import {Tooltip} from '@mui/material'
import React, {useCallback, useContext, useState} from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt.js'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import FilterDialog from './FilterDialog.jsx'
import FilterContext from './FilterContext.jsx'

function FilterButton({data, onChangeTab}) {
    const [open, setOpen] = useState(false)
    const {filterCount} = useContext(FilterContext)

    const openDialog = useCallback(() => setOpen(true), [])
    const closeDialog = useCallback(() => setOpen(false), [])

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
            <FilterDialog
                data={data}
                open={open}
                onChangeTab={onChangeTab}
                onClose={closeDialog}
            />
        </React.Fragment>
    )
}

export default FilterButton
