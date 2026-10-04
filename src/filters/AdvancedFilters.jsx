import React, {useCallback, useContext, useEffect, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import AdvancedFilterField from './AdvancedFilterField.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import FilterContext from '../context/FilterContext.jsx'
import Button from '@mui/material/Button'
import DataContext from '../context/DataContext.jsx'
import {Collapse} from '@mui/material'
import queryString from 'query-string'
import {useLocation} from 'react-router-dom'
import FilterScopeToggle from './FilterScopeToggle.jsx'
import ResetFiltersButton from './ResetFiltersButton.jsx'
import useAdvancedFilterRows from './useAdvancedFilterRows.js'

export default function AdvancedFilters() {
    const {
        showAdvancedSearch,
        setShowAdvancedSearch,
        hideAdvancedSearch,
        filterCount,
        removeFilters,
        clearFilters
    } = useContext(FilterContext)
    const {visibleEntries = [], visibleBeltEntries} = useContext(DataContext)
    const {visibleFilterGroups, addFilter, changeGroup, removeGroup} = useAdvancedFilterRows()

    const location = useLocation()
    const searchParams = queryString.parse(location.search)
    useEffect(() => {
        if (searchParams.preview === 'advanced') {
            setShowAdvancedSearch(true)
            removeFilters(['preview'])
        }
    }, [removeFilters, searchParams.preview, setShowAdvancedSearch])

    const handleClearAll = useCallback(() => {
        clearFilters()
    }, [clearFilters])

    useEffect(() => {
        if (filterCount > 0) setShowAdvancedSearch(true)
    }, [filterCount, setShowAdvancedSearch])

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, borderRadius: 0}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    const paddingLeft = isMobile ? 8 : 16
    const resetMarginTop = isMobile ? 2 : 0

    const [transitionIn, setTransitionIn] = useState(false)
    useEffect(() => {
        if (hideAdvancedSearch) setTransitionIn(false)
        else if (showAdvancedSearch || filterCount > 0) {
                setTransitionIn(true)
        }
    }, [showAdvancedSearch, filterCount, hideAdvancedSearch])

    const [renderContent, setRenderContent] = useState(false)
    useEffect(() => {
        if (showAdvancedSearch || filterCount > 0) setRenderContent(true)
        else {
            const timeout = setTimeout(() => {
                setRenderContent(false)
            }, 300)
            return () => clearTimeout(timeout)
        }
    }, [showAdvancedSearch, filterCount])

    return (
        <Collapse in={transitionIn} unmountOnExit>
            {renderContent &&
                <Card style={{...style, paddingBottom: 0, paddingTop: 16}} id='advanced-filters'>
                    <CardContent style={{
                        paddingTop: 0,
                        paddingLeft: paddingLeft,
                        paddingRight: paddingLeft,
                        alignItems: 'top'
                    }}>
                        <div style={{display: 'flex', alignItems: 'top', marginBottom: 16}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'top'}}>
                                <div style={{
                                    display: 'flex',
                                    marginRight: 36,
                                    marginBottom: 0,
                                    alignItems: 'center'
                                }}>
                                    <div style={{fontWeight: 600, fontSize: '1.3rem'}}>Filters</div>
                                    <div style={{
                                        fontWeight: 400,
                                        fontSize: '1.0rem',
                                        marginLeft: 8
                                    }}>({(visibleBeltEntries || visibleEntries || []).length || 0} Lock{(visibleBeltEntries || visibleEntries || []).length !== 1 && 's'})
                                    </div>
                                </div>
                                <FilterScopeToggle style={{margin: '16px 0px 0px 0px'}}/>
                            </div>
                            <div style={{
                                flexGrow: 1,
                                textAlign: 'right',
                                alignItems: 'top',
                                marginTop: resetMarginTop
                            }}>
                                <ResetFiltersButton alwaysShow/>
                            </div>
                        </div>

                        <div
                            style={{display: 'flex', flexDirection: 'column'}}>
                            {visibleFilterGroups.map(group => (
                                <AdvancedFilterField
                                    key={group._id}
                                    group={{...group, groupId: group._id}}
                                    groupIndex={group.groupIndex}
                                    onChange={(updated) => changeGroup(group._id, updated)}
                                    onRemove={() => removeGroup(group._id)}
                                />
                            ))}
                        </div>

                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                            <Button onClick={handleClearAll} variant='contained' size='small'
                                    style={{backgroundColor: '#444', marginRight: 16}}>
                                Clear</Button>
                            <Button onClick={addFilter} variant='contained' color='info' size='small'>
                                Add Filter</Button>
                        </div>

                    </CardContent>
                </Card>
            }
        </Collapse>
    )
}
