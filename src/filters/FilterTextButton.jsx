import React, {useCallback, useContext, useState} from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import AuthContext from '../app/AuthContext'
import FilterContext from '../context/FilterContext'
import FilterByField from './FilterByField'
import Stack from '@mui/material/Stack'
import ClearFiltersButton from './ClearFiltersButton'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import AppContext from '../app/AppContext'
import {useHotkeys} from 'react-hotkeys-hook'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import belts from '../data/belts'
import LockListContext from '../locks/LockListContext.jsx'

function FilterTextButton({onFiltersChanged}) {

    const {isLoggedIn} = useContext(AuthContext)
    const {beta} = useContext(AppContext)
    const {filters, filterCount, addFilters, addFilter, filterFields, removeFilters} = useContext(FilterContext)
    const {tab} = useContext(LockListContext)
    const {belt} = filters

    const isLocks = /\/locks/.test(location.hash)
    const beltScope = tab
        ? tab
        : belt
            ? belt
            : 'White'

    const [initialBelt, setInitialBelt] = useState(beltScope)
    const [scope, setScope] = useState('belt')

    if (beltScope !== initialBelt && beltScope !== 'search') {
        setScope('belt')
        setInitialBelt(beltScope)
    } else if (scope === 'belt' && beltScope === 'search') {
        setScope('all')
        setInitialBelt(beltScope)
    }

    const {color, lineColor = '#999'} = belts[initialBelt] ? belts[initialBelt] : {color: '#inherit'}

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
        setScope(value)
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
                        FILTER
                    </Badge>
                </Button>
            </Tooltip>

            {open &&
                <Drawer
                    anchor='right'
                    open={open}
                    onClose={closeDrawer}
                >
                    <Toolbar variant='dense' onClick={closeDrawer} style={{padding: '8px 0px 0px 8px'}}>
                        <div style={{fontSize: '1.3rem', fontWeight: 700}}>Filters</div>
                    </Toolbar>

                    {belts[initialBelt] && isLocks &&
                        <div style={{marginLeft: 8, marginBottom: 8}}>
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
                                        marginRight: 8
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

export default FilterTextButton
