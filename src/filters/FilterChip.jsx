import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, {useCallback, useContext, useMemo, useState} from 'react'
import Chip from '@mui/material/Chip'
import {useNavigate} from 'react-router-dom'
import FilterContext from '../context/FilterContext'
import glossary from '../data/glossary.json'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

function FilterChip({field, value, label = value, mode, clickable = true, ...props}) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const {addAdvancedFilterGroup} = useContext(FilterContext)

    const handleClose = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setOpen(false)
    }, [])

    const handleFilter = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setOpen(false)
        addAdvancedFilterGroup({fieldName: field, valueToAdd: value, operator: 'AND'})
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [addAdvancedFilterGroup, field, value])

    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setOpen(event.target)
    }, [])

    const handleGoToGlossary = useCallback(event => {
        event.stopPropagation()
        setOpen(false)
        const safeValue = encodeURI(value)
        setTimeout(() => navigate(`/glossary?term=${safeValue}`), 0)
    }, [navigate, value])

    const termFound = useMemo(() => {
        return !!glossary.find(entry => entry.term.toLowerCase() === value.toLowerCase())
    }, [value])

    return (
        <React.Fragment>
            {(!mode || mode === 'full') && termFound &&
                <React.Fragment>
                    <Chip
                        clickable={clickable}
                        variant='outlined'
                        label={label}
                        style={{marginRight: 4, marginBottom: 4}}
                        onClick={handleOpen}
                        {...props}
                    />
                    {!!open &&
                        <Menu
                            open={!!open}
                            anchorEl={open}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            onClose={handleClose}
                        >
                            <MenuItem disabled>Term: {value}</MenuItem>
                            <Divider/>
                            <MenuItem onClick={handleFilter}>Add Filter</MenuItem>
                            <MenuItem onClick={handleGoToGlossary} disabled={!termFound}>
                                Go to Glossary
                            </MenuItem>
                        </Menu>
                    }
                </React.Fragment>
            }
            {(mode === 'simple' || ((!mode || mode === 'full') && !termFound)) &&
                <Chip
                    clickable={clickable}
                    variant='outlined'
                    label={label}
                    style={{marginRight: 4, marginBottom: 4}}
                    onClick={clickable ? handleFilter : () => {
                    }}
                    {...props}
                />
            }
            {(mode === 'div') &&
                <Box
                    style={{
                        display: 'inline-block',
                        color: '#fff',
                        fontSize: '0.85rem',
                        border: '1px solid #666',
                        borderRadius: 16,
                        padding: '2px 10px',
                        cursor: 'pointer',
                        marginRight: 4,
                        marginBottom: 4
                    }}
                    sx={{
                        '&:hover': {
                            backgroundColor: '#333'
                        }
                    }}
                    onClick={handleFilter}
                    {...props}
                >
                    {label}
                </Box>
            }
            {(mode === 'text') &&
                <Link
                    style={{color: '#fff'}}
                    onClick={handleFilter}
                    {...props}
                >
                    {label}
                </Link>
            }
        </React.Fragment>
    )
}

export default FilterChip
