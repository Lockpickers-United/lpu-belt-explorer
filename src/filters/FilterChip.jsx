import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, {useCallback, useContext, useState} from 'react'
import Chip from '@mui/material/Chip'
import {useNavigate} from 'react-router-dom'
import AppContext from '../app/AppContext'
import FilterContext from '../locks/FilterContext'

function FilterChip({field, value, ...props}) {
    const {beta} = useContext(AppContext)
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const {addFilter} = useContext(FilterContext)

    const handleClose = useCallback(() => setOpen(false), [])

    const handleFilter = useCallback(() => {
        handleClose()
        addFilter(field, value)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [addFilter, field, handleClose, value])

    const handleOpen = useCallback(event => {
        if (beta) setOpen(event.target)
        else handleFilter()
    }, [beta, handleFilter])

    const handleGoToGlossary = useCallback(() => {
        navigate(`/glossary?term=${value}`)
    }, [navigate, value])

    return (
        <React.Fragment>
            <Chip
                clickable
                variant='outlined'
                label={value}
                style={{marginRight: 4, marginBottom: 4}}
                onClick={handleOpen}
                {...props}
            />
            <Menu
                open={!!open}
                anchorEl={open}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                onClose={handleClose}
            >
                <MenuItem disabled>Term: {value}</MenuItem>
                <Divider/>
                <MenuItem onClick={handleFilter}>Add Filter</MenuItem>
                <MenuItem onClick={handleGoToGlossary}>Go to Glossary</MenuItem>
            </Menu>
        </React.Fragment>
    )
}

export default FilterChip
