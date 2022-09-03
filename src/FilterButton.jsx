import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, {useMemo, useState} from 'react'
import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import queryString from 'query-string'
import {Button, Dialog, DialogContent, Slide} from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt.js'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import FieldValue from './FieldValue.jsx'
import FilterByField from './FilterByField.jsx'

function FilterButton() {
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

    const [open, setOpen] = useState(false)
    const closeDialog = () => setOpen(false)

    const handleAddFilter = (keyToAdd, valueToAdd) => {
        const queryValue = query[keyToAdd]
        if (Array.isArray(queryValue)) queryValue.push(valueToAdd)
        else if (queryValue) query[keyToAdd] = [queryValue, valueToAdd]
        else query[keyToAdd] = valueToAdd
        setQuery({...query})
    }

    const handleDeleteFilter = (keyToDelete, valueToDelete) => () => {
        const queryValue = query[keyToDelete]
        if (Array.isArray(queryValue)) query[keyToDelete] = query[keyToDelete].filter(value => value !== valueToDelete)
        else query[keyToDelete] = undefined
        setQuery({...query})
    }

    const handleSave = () => {
        location.search = queryString.stringify(query)
    }

    return (
        <React.Fragment>
            <Badge badgeContent={filters.length} color='secondary' overlap='circular' anchorOrigin={{
                vertical: 'bottom', horizontal: 'right'
            }}>
                <IconButton color='inherit' onClick={() => setOpen(true)}>
                    <FilterAltIcon/>
                </IconButton>
            </Badge>
            <Dialog
                fullScreen
                open={open}
                onClose={closeDialog}
                TransitionComponent={Transition}
            >
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge='start'
                            color='inherit'
                            onClick={closeDialog}
                            aria-label='close'
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant='h6' component='div'>
                            Filters
                        </Typography>
                        <Button autoFocus color='inherit' onClick={handleSave}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <FieldValue name='Current Filters' value={
                        <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}} style={{marginRight: -24}}>
                            {filters.map(({key, value: filter}, index) =>
                                <Chip
                                    key={index}
                                    label={filter}
                                    variant='outlined'
                                    style={{marginRight: 4, marginBottom: 4}}
                                    onDelete={handleDeleteFilter(key, filter)}
                                />
                            )}
                        </Stack>
                    }/>
                    <FieldValue name='Add Filters' value={
                        <Stack direction='column' style={{marginTop: 8, maxWidth: 350}}>
                            <FilterByField field='Belt' onFilter={handleAddFilter}/>
                            <FilterByField field='Make' onFilter={handleAddFilter}/>
                            <FilterByField field='Type' onFilter={handleAddFilter}/>
                            <FilterByField field='Tags' onFilter={handleAddFilter}/>
                            <FilterByField field='Regions' onFilter={handleAddFilter}/>
                        </Stack>
                    }/>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
})

export default FilterButton
