import React, {useCallback, useContext, useMemo, useState} from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import AuthContext from '../app/AuthContext'
import FilterContext from '../context/FilterContext'
import FilterByField from './FilterByField'
import Stack from '@mui/material/Stack'
import ClearFiltersButton from './ClearFiltersButton'
import Button from '@mui/material/Button'
import AppContext from '../app/AppContext'
import {useHotkeys} from 'react-hotkeys-hook'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import belts from '../data/belts'
import LockListContext from '../locks/LockListContext.jsx'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import DataContext from '../context/DataContext.jsx'

function AdvancedFilterTextButton({onFiltersChanged}) {

    const {isLoggedIn} = useContext(AuthContext)
    const {beta} = useContext(AppContext)
    const {filters, filterCount, addFilters, addFilter, filterFields, removeFilters, showAdvancedSearch, setShowAdvancedSearch} = useContext(FilterContext)
    const {tab} = useContext(LockListContext)
    const {beltEntries = []} = useContext(DataContext)
    const {belt} = filters

    const isLocks = /\/locks/.test(location.hash)
    const beltScope = useMemo(() => {
        return tab
            ? tab
            : belt
                ? belt
                : 'White'
    }, [belt, tab])
    const scope = useMemo(() => beltScope !== 'search' ? 'belt' : 'all', [beltScope])

    const [initialBelt, setInitialBelt] = useState(beltScope)

    if (beltScope !== initialBelt && beltScope !== 'search') {
        setInitialBelt(beltScope)
    } else if (scope === 'belt' && beltScope === 'search') {
        setInitialBelt('search')
    }

    const [open, setOpen] = useState(false)
    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('f', handleHotkey)

    const changeScope = useCallback(value => () => {
        if (value === 'all') {
            addFilter('tab', 'search', true)
        } else if (value === 'belt') {
            removeFilters(['belt'])
            addFilter('tab', initialBelt, true)
        }
    }, [addFilter, initialBelt, removeFilters])

    const handleAddFilter = useCallback((keyToAdd, valueToAdd) => {
        addFilters([
            {key: keyToAdd, value: valueToAdd},
            {key: 'id', value: undefined},
            {key: 'name', value: undefined}
        ], true)
        onFiltersChanged && onFiltersChanged()
    }, [addFilters, onFiltersChanged])

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    const handleToggleAdvanced = useCallback(() => {
        setShowAdvancedSearch(!showAdvancedSearch)
    }, [setShowAdvancedSearch, showAdvancedSearch])

    const {color, lineColor = '#999'} = belts[initialBelt] ? belts[initialBelt] : {color: '#inherit'}
    const beltOpacity = scope === 'belt' ? 1 : 0.7

    const linkSx = {
        color: '#ddd', textDecoration: 'underline', cursor: 'pointer', '&:hover': {
            color: '#fff'
        }
    }

    const {width} = useWindowSize()
    const smallWidth = width <= 500

    return (
        <React.Fragment>
            <Tooltip title='Filter' arrow disableFocusListener>
                <Button color='inherit' onClick={openDrawer} style={{color: '#ddd'}}>
                    <Badge
                        variant='dot'
                        badgeContent={filterCount}
                        color='secondary'
                        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    >
                        {!smallWidth ? 'FILTER' : <FilterAltIcon/>}
                    </Badge>
                </Button>
            </Tooltip>

            {open &&
                <Drawer
                    anchor='right'
                    open={open}
                    onClose={closeDrawer}
                    sx={{
                        '.MuiDrawer-paper': {
                            padding: 1
                        }
                    }}
                >
                    <div style={{display: 'flex', alignItems: 'center', padding: '16px 8px 8px 8px'}} onClick={closeDrawer}>
                        <div style={{fontWeight: 700, fontSize: '1.3rem'}}>Filters</div>
                        {beltEntries.length > 1 &&
                            <div style={{
                                fontWeight: 400,
                                fontSize: '1.0rem',
                                marginLeft: 8
                            }}>({beltEntries.length} Locks)</div>
                        }
                        <div style={{flexGrow:1, textAlign:'right', fontSize: '0.9rem'}}>
                            <Link onClick={handleToggleAdvanced} sx={linkSx}>{showAdvancedSearch ? '' : 'Advanced'}</Link>
                        </div>
                    </div>



                    {belts[initialBelt] && isLocks &&
                        <div style={{margin: '16px 8px 0px 8px'}}>
                            <ToggleButtonGroup
                                variant='outlined'
                            >
                                <ToggleButton
                                    key={'belt'}
                                    onClick={changeScope('belt')}
                                    style={{
                                        color: scope === 'belt' ? '#eee' : '#777',
                                        backgroundColor: scope === 'belt' ? 'inherit' : '#111',
                                        padding: '6px 12px', borderColor: '#666'
                                    }}
                                    value={'belt'}
                                    disabled={scope === 'belt'}
                                >
                                    <div style={{
                                        backgroundColor: color,
                                        height: 16,
                                        width: 16,
                                        borderColor: lineColor,
                                        borderRadius: 8,
                                        border: '1px solid',
                                        marginRight: 8,
                                        opacity: beltOpacity
                                    }}/>
                                    {initialBelt} BELT
                                </ToggleButton>
                                <ToggleButton
                                    key={'all'}
                                    onClick={changeScope('all')}
                                    style={{
                                        color: scope === 'all' ? '#eee' : '#777',
                                        backgroundColor: scope === 'all' ? 'inherit' : '#111',
                                        padding: '6px 12px', borderColor: '#666'
                                    }}
                                    value={'all'}
                                    disabled={scope === 'all'}
                                >ALL LOCKS</ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    }

                    <Box margin={1}>
                        <Stack direction='column' style={{minWidth: 250}}>
                            {filterFields
                                .filter(field => {
                                    return (!field.beta || beta) && (!field.userBased || isLoggedIn)
                                })
                                .filter(field => {
                                    return !(scope === 'belt' && tab !== 'search' && field.label === 'Belt')
                                })
                                .map((field, index) =>
                                    <FilterByField
                                        tab={tab}
                                        key={index}
                                        {...field}
                                        onFilter={handleAddFilter}
                                    />
                                )}
                        </Stack>
                    </Box>
                    <div style={{padding: 8}}>
                        <ClearFiltersButton forceText/>
                        <Button
                            variant='outlined'
                            color='inherit'
                            onClick={closeDrawer}
                        >
                            Done
                        </Button>
                    </div>
                </Drawer>
            }
        </React.Fragment>
    )
}

export default AdvancedFilterTextButton
