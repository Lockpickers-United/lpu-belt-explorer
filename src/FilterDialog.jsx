import CloseIcon from '@mui/icons-material/Close.js'
import {Button, Dialog, DialogContent, Slide} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import React, {useContext} from 'react'
import FieldValue from './FieldValue.jsx'
import FilterByField from './FilterByField.jsx'
import FilterContext from './FilterContext.jsx'
import FilterDisplay from './FilterDisplay.jsx'
import filterFields from './data/filterFields.js'

function FilterDialog({data, open, onClose, onChangeTab}) {
    const {filters, filterCount, addFilter, clearFilters} = useContext(FilterContext)

    const handleAddFilter = (keyToAdd, valueToAdd) => {
        setTimeout(() => addFilter(keyToAdd, valueToAdd), 0)
    }

    const handleClear = () => {
        if (!filters.search) onChangeTab('white')
        onClose()
        setTimeout(() => clearFilters(), 0)
    }

    const handleSave = () => {
        onClose()
        if (filterCount) onChangeTab('search')
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
                <div style={{maxWidth: 350, marginLeft: 'auto', marginRight: 'auto'}}>
                    <FilterDisplay/>

                    <FieldValue
                        name='Add Filters'
                        value={
                            <Stack direction='column' style={{marginTop: 8, width: 350}}>
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
                        }
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
})

export default FilterDialog
