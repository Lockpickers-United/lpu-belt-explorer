import CloseIcon from '@mui/icons-material/Close.js'
import {Button, Dialog, DialogContent, Slide} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import queryString from 'query-string'
import React from 'react'
import FieldValue from './FieldValue.jsx'
import FilterByField from './FilterByField.jsx'

function FilterDialog({filters, open, onClose, query, setQuery}) {
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

    const handleClear = () => {
        onClose()
        setTimeout(() => location.search = '', 100)
    }

    const handleSave = () => {
        onClose()
        setTimeout(() => location.search = queryString.stringify(query), 100)
    }

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge='start'
                        color='inherit'
                        onClick={onClose}
                        aria-label='close'
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant='h6' component='div'>
                        Filters
                    </Typography>

                    <Stack spacing={0.5} alignItems='center' direction='row'>
                        <Button color='error' onClick={handleClear}>
                            clear
                        </Button>
                        <Button autoFocus color='inherit' onClick={handleSave} style={{marginRight: -8}}>
                            save
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            <DialogContent>
                {
                    !!filters.length &&
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
                }

                <FieldValue name='Add Filters' value={
                    <Stack direction='column' style={{marginTop: 8, maxWidth: 350}}>
                        {filterFields.map((field, index) =>
                            <FilterByField key={index} field={field} onFilter={handleAddFilter}/>
                        )}
                    </Stack>
                }/>
            </DialogContent>
        </Dialog>
    )
}

const filterFields = [
    'Belt',
    'Make',
    'Type',
    'Tags',
    'Regions'
]

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
})

export default FilterDialog
