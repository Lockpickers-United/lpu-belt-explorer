import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import AuthContext from '../app/AuthContext'
import FilterContext from '../context/FilterContext'
import AdvancedFilterByField from './AdvancedFilterByField'
import ClearFiltersButton from './ClearFiltersButton'
import ResetFiltersButton from './ResetFiltersButton'
import Button from '@mui/material/Button'
import AppContext from '../app/AppContext'
import {useHotkeys} from 'react-hotkeys-hook'
import LockListContext from '../locks/LockListContext.jsx'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import DataContext from '../context/DataContext.jsx'
import FilterScopeToggle from './FilterScopeToggle.jsx'
import {motion} from 'motion/react'

function AdvancedFilterDrawerButton() {
    const [open, setOpen] = useState(false)

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
    const {visibleEntries = [], visibleBeltEntries} = useContext(DataContext)
    const {belt} = filters

    const filterList = useMemo(() => {
        const activeFilters = advancedFilterGroups()
            .filter(group => group.fieldName.length > 0 && Array.isArray(group.values) && group.values.length > 0)
            .map(group => {
                const field = filterFields.find(f => f.fieldName === group.fieldName)
                return {...field, active: true}
            })
        const otherFilters = filterFields
            .filter(field => !activeFilters.find(f => f.fieldName === field.fieldName))
        return [...activeFilters, ...otherFilters]
    }, [advancedFilterGroups, filterFields])

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

    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('f', handleHotkey)

    const handleQuickAdd = useCallback((fieldName, valueToAdd) => {
        if (!fieldName || !valueToAdd) return
        setShowAdvancedSearch(true)
        const groups = [...advancedFilterGroups().filter(group => group.fieldName.length > 0)]

        const existingIndex = groups.findIndex(g => g.fieldName === fieldName && Array.isArray(g.values) && g.values.length > 0)
        if (existingIndex >= 0) {
            const existing = groups[existingIndex]
            if (existing.values.includes(valueToAdd)) return
            groups[existingIndex] = {
                ...existing,
                values: [valueToAdd]
            }
            setAdvancedFilterGroups(groups)
            return
        }
        const newGroup = {
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName,
            matchType: 'Is',
            operator: 'OR',
            values: [valueToAdd]
        }
        setAdvancedFilterGroups([...groups, newGroup])
    }, [advancedFilterGroups, setAdvancedFilterGroups, setShowAdvancedSearch])

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

    const [renderContent, setRenderContent] = useState(false)
    useEffect(() => {
        if (open) setRenderContent(true)
        else {
            const timeout = setTimeout(() => {
                setRenderContent(false)
            }, 300)
            return () => clearTimeout(timeout)
        }
    }, [open])

    return (
        <React.Fragment>
            <Tooltip title='Filter' arrow disableFocusListener>
                <Button color='inherit' onClick={openDrawer} style={{color: '#ddd'}}>
                    <Badge
                        variant='dot'
                        badgeContent={filterCount}
                        color='warning'
                        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    >
                        {!smallWidth ? 'FILTER' : <FilterAltIcon/>}
                    </Badge>
                </Button>
            </Tooltip>

            <Drawer
                anchor='right'
                open={open}
                onClose={closeDrawer}
                sx={{
                    '.MuiDrawer-paper': {
                        width: 280,
                        padding: 1
                    }
                }}
            >
                {renderContent &&
                    <React.Fragment>
                        <div style={{display: 'flex', alignItems: 'center', margin: '8px 8px 12px 8px', height: 38}}
                             onClick={closeDrawer}>
                            <div style={{fontWeight: 700, fontSize: '1.3rem'}}>Filters</div>
                            <div style={{
                                fontWeight: 400,
                                fontSize: '1.0rem',
                                marginLeft: 8
                            }}>({(visibleBeltEntries || visibleEntries).length || 0} Lock{(visibleBeltEntries || visibleEntries).length !== 1 && 's'})
                            </div>
                            <div style={{flexGrow: 1, textAlign: 'right', fontSize: '0.9rem'}}>
                                {!showAdvancedSearch
                                    ? <Link onClick={handleToggleAdvanced}
                                            sx={linkSx}>{showAdvancedSearch ? 'Reset' : 'Advanced'}</Link>
                                    : <ResetFiltersButton advanced drawer/>
                                }

                            </div>
                        </div>

                        <FilterScopeToggle style={{margin: '0px 0px 8px 8px'}}/>

                        <Box margin={1}>
                            <motion.div layout style={{minWidth: 250}}>
                                {filterList
                                    .filter(field => {
                                        return (!field.beta || beta) && (!field.userBased || isLoggedIn)
                                    })
                                    .filter(field => {
                                        return !(scope === 'belt' && tab !== 'search' && field.label === 'Belt')
                                    })
                                    .map((field) => {
                                        const groupsArr = advancedFilterGroups()
                                        const existingIndex = groupsArr.findIndex(g => g.fieldName === field.fieldName && Array.isArray(g.values) && g.values.length > 0)
                                        const existing = existingIndex >= 0 ? groupsArr[existingIndex] : null

                                        const group = existing ? {
                                            ...existing,
                                            groupIndex: existingIndex
                                        } : {
                                            fieldName: field.fieldName,
                                            groupIndex: -1,
                                            matchType: 'Is',
                                            operator: 'OR',
                                            values: ['']
                                        }

                                        const currentValue = existing ? (existing.values?.[0] || '') : ''
                                        const matchType = existing ? existing.matchType || 'Is' : 'Is'
                                        const operator = existing ? existing.operator || 'OR' : 'OR'
                                        const groupIndex = existing ? existingIndex : 0
                                        return (
                                            <motion.div key={field.fieldName} layout
                                                        transition={{visualDuration: 0.25, ease: ['easeOut']}}>
                                                <AdvancedFilterByField
                                                    {...field}
                                                    active={field.active}
                                                    label={field.label}
                                                    group={group}
                                                    groupIndex={groupIndex}
                                                    matchType={matchType}
                                                    operator={operator}
                                                    valueIndex={0}
                                                    currentValue={currentValue}
                                                    onFilter={(val) => handleQuickAdd(field.fieldName, val)}
                                                    onRemove={() => {
                                                    }}
                                                    handleAddValue={() => {
                                                    }}
                                                    size='small'
                                                    context='drawer'
                                                />
                                            </motion.div>
                                        )
                                    })}
                            </motion.div>
                        </Box>
                        <div style={{padding: 8}}>
                            <ClearFiltersButton forceText/>
                            <Button variant='outlined' color='inherit' onClick={closeDrawer}>
                                Close
                            </Button>
                        </div>
                    </React.Fragment>
                }
            </Drawer>
        </React.Fragment>
    )
}

export default AdvancedFilterDrawerButton
