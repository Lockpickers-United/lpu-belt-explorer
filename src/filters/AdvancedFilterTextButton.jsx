import React, {useCallback, useContext, useMemo, useState} from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import AuthContext from '../app/AuthContext'
import FilterContext from '../context/FilterContext'
import AdvancedFilterByField from './AdvancedFilterByField'
import Stack from '@mui/material/Stack'
import ClearFiltersButton from './ClearFiltersButton'
import Button from '@mui/material/Button'
import AppContext from '../app/AppContext'
import {useHotkeys} from 'react-hotkeys-hook'
import LockListContext from '../locks/LockListContext.jsx'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import DataContext from '../context/DataContext.jsx'
import FilterScopeToggle from './FilterScopeToggle.jsx'

function AdvancedFilterTextButton({onFiltersChanged}) {

    const {isLoggedIn} = useContext(AuthContext)
    const {beta} = useContext(AppContext)
    const {
        filters,
        filterCount,
        filterFields,
        showAdvancedSearch,
        setShowAdvancedSearch,
        advancedFilterGroups,
        setAdvancedFilterGroups
    } = useContext(FilterContext)
    const {tab} = useContext(LockListContext)
    const {beltEntries = []} = useContext(DataContext)
    const {belt} = filters

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

    const handleQuickAdd = useCallback((fieldName, valueToAdd) => {
        if (!fieldName || !valueToAdd) return
        const groups = advancedFilterGroups()
        const newGroup = {
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName,
            matchType: 'Is',
            operator: 'OR',
            values: [valueToAdd]
        }
        setAdvancedFilterGroups([...groups, newGroup])
        onFiltersChanged && onFiltersChanged()
    }, [advancedFilterGroups, onFiltersChanged, setAdvancedFilterGroups])


    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    const handleToggleAdvanced = useCallback(() => {
        setShowAdvancedSearch(!showAdvancedSearch)
    }, [setShowAdvancedSearch, showAdvancedSearch])

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
                    <div style={{display: 'flex', alignItems: 'center', padding: '16px 8px 8px 8px'}}
                         onClick={closeDrawer}>
                        <div style={{fontWeight: 700, fontSize: '1.3rem'}}>Filters</div>
                        {beltEntries.length > 1 &&
                            <div style={{
                                fontWeight: 400,
                                fontSize: '1.0rem',
                                marginLeft: 8
                            }}>({beltEntries.length} Locks)</div>
                        }
                        <div style={{flexGrow: 1, textAlign: 'right', fontSize: '0.9rem'}}>
                            <Link onClick={handleToggleAdvanced}
                                  sx={linkSx}>{showAdvancedSearch ? '' : 'Advanced'}</Link>
                        </div>
                    </div>

                    <FilterScopeToggle style={{margin: '8px 0px 8px 8px'}}/>

                    <Box margin={1}>
                        <Stack direction='column' style={{minWidth: 250}}>
                            {filterFields
                                .filter(field => {
                                    return (!field.beta || beta) && (!field.userBased || isLoggedIn)
                                })
                                .filter(field => {
                                    return !(scope === 'belt' && tab !== 'search' && field.label === 'Belt')
                                })
                                .map((field, index) => {
                                    const groupsArr = advancedFilterGroups()
                                    const existingIndex = groupsArr.findIndex(g => g.fieldName === field.fieldName && Array.isArray(g.values) && g.values.length > 0)
                                    const existing = existingIndex >= 0 ? groupsArr[existingIndex] : null

                                    const group = existing ? {
                                        ...existing,
                                        groupIndex: existingIndex
                                    } : {
                                        fieldName: field.fieldName,
                                        groupIndex: 0,
                                        matchType: 'Is',
                                        operator: 'OR',
                                        values: ['']
                                    }

                                    const currentValue = existing ? (existing.values?.[0] || '') : ''
                                    const matchType = existing ? existing.matchType || 'Is' : 'Is'
                                    const operator = existing ? existing.operator || 'OR' : 'OR'
                                    const groupIndex = existing ? existingIndex : 0

                                    return (
                                        <AdvancedFilterByField
                                            key={field.fieldName || index}
                                            label={field.label}
                                            group={group}
                                            groupIndex={groupIndex}
                                            matchType={matchType}
                                            operator={operator}
                                            valueIndex={0}
                                            currentValue={currentValue}
                                            onFilter={(val) => handleQuickAdd(field.fieldName, val)}
                                            onRemove={() => {}}
                                            handleAddValue={() => {}}
                                            size='small'
                                            context='drawer'
                                        />
                                    )
                                })}
                        </Stack>
                    </Box>
                    <div style={{padding: 8}}>
                        <ClearFiltersButton forceText/>
                        <Button variant='outlined' color='inherit' onClick={closeDrawer}>
                            Done
                        </Button>
                    </div>
                </Drawer>
            }
        </React.Fragment>
    )
}

export default AdvancedFilterTextButton
