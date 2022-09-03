import React, {useMemo, useState} from 'react'
import queryString from 'query-string'
import FilterAltIcon from '@mui/icons-material/FilterAlt.js'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import FilterDialog from './FilterDialog.jsx'

function FilterButton() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState(queryString.parse(location.search))
    const filters = useMemo(() => {
        return Object.keys(query)
            .map(key => {
                const value = query[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()
            .filter(({value}) => value)
    }, [query])

    const openDialog = () => {
        setQuery(queryString.parse(location.search))
        setOpen(true)
    }
    const closeDialog = () => {
        setQuery(queryString.parse(location.search))
        setOpen(false)
    }

    return (
        <React.Fragment>
            <Badge badgeContent={filters.length} color='secondary' overlap='circular' anchorOrigin={{
                vertical: 'bottom', horizontal: 'right'
            }}>
                <IconButton color='inherit' onClick={openDialog}>
                    <FilterAltIcon/>
                </IconButton>
            </Badge>
            <FilterDialog
                open={open}
                query={query}
                filters={filters}
                setQuery={setQuery}
                onClose={closeDialog}
            />
        </React.Fragment>
    )
}

export default FilterButton
