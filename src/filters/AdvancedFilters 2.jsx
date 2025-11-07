import React, {useCallback, useContext, useEffect} from 'react'
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

export default function AdvancedFilters() {
    const {
        advancedFilterGroups,
        setAdvancedFilterGroups,
        showAdvancedSearch,
        setShowAdvancedSearch,
        filterCount,
        removeFilters,
        clearFilters
    } = useContext(FilterContext)
    const {visibleBeltEntries = []} = useContext(DataContext)

    const location = useLocation()
    const searchParams = queryString.parse(location.search)
    useEffect(() => {
        if (searchParams.preview === 'advanced') {
            setShowAdvancedSearch(true)
            removeFilters(['preview'])
        }
    }, [removeFilters, searchParams.preview, setShowAdvancedSearch])

    const addFilter = useCallback(() => {
        const next = [...advancedFilterGroups(), {
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName: '',
            matchType: 'Is',
            operator: 'OR',
            values: []
        }]
        setAdvancedFilterGroups(next)
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    const handleClearAll = useCallback(() => {
        clearFilters()
    }, [clearFilters])

    const handleChangeGroup = useCallback((idx, updated) => {
        const groups = advancedFilterGroups()
        const next = groups.map((g, i) => (i === idx ? {...g, ...updated} : g))
        setAdvancedFilterGroups(next)
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    const handleRemoveGroup = useCallback((idx) => {
        const groups = advancedFilterGroups()
        let next = groups.filter((_, i) => i !== idx)
        if (next.length === 0) next = [{
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName: '',
            matchType: 'Is',
            operator: 'OR',
            values: []
        }]
        setAdvancedFilterGroups(next)
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    useEffect(() => {
        if (advancedFilterGroups().length === 0) {
            setAdvancedFilterGroups([{
                _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                fieldName: '',
                matchType: 'Is',
                operator: 'OR',
                values: []
            }])
        }
        if (filterCount > 0) setShowAdvancedSearch(true)
    }, [advancedFilterGroups, filterCount, setAdvancedFilterGroups, setShowAdvancedSearch])

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, borderRadius: 0}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    const paddingLeft = isMobile ? 8 : 16
    const resetMarginTop = isMobile ? 2 : 0

    return (
        <React.Fragment>
            <Collapse in={showAdvancedSearch || filterCount > 0} unmountOnExit={true}>
                <Card style={{...style, paddingBottom: 8, paddingTop: 16}}>
                    <CardContent style={{paddingTop: 0, paddingLeft: paddingLeft, alignItems: 'top'}}>

                        <div style={{display: 'flex', alignItems: 'top', marginBottom:16}}>
                            <div style={{display: 'flex', flexDirection:'column', alignItems: 'top'}}>
                                <div style={{display: 'flex', marginRight: 36, marginBottom:0, alignItems: 'center'}}>
                                    <div style={{fontWeight: 700, fontSize: '1.3rem'}}>Advanced Filters</div>
                                    <div style={{
                                        fontWeight: 400,
                                        fontSize: '1.0rem',
                                        marginLeft: 8
                                    }}>({visibleBeltEntries?.length || 0} Lock{visibleBeltEntries?.length !== 1 && 's'})
                                    </div>
                                </div>
                                <FilterScopeToggle style={{margin: '16px 0px 0px 0px'}}/>
                            </div>
                            <div style={{flexGrow: 1, textAlign: 'right', alignItems: 'top', marginTop:resetMarginTop}}>
                                <ResetFiltersButton alwaysShow/>
                            </div>
                        </div>

                        <div
                            style={{display: 'flex', flexDirection: 'column'}}>
                            {advancedFilterGroups().map((group, index) => (
                                <AdvancedFilterField
                                    key={group._id || index}
                                    group={{...group, groupIndex: index, groupId: group._id}}
                                    groupIndex={index}
                                    onChange={(updated) => handleChangeGroup(index, updated)}
                                    onRemove={() => handleRemoveGroup(index)}
                                />
                            ))}
                        </div>

                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 16}}>
                            <Button onClick={handleClearAll} variant='contained' size='small'
                                    style={{backgroundColor: '#444', marginRight: 16}}>
                                Clear</Button>
                            <Button onClick={addFilter} variant='contained' color='info' size='small'>
                                Add Filter</Button>
                        </div>

                    </CardContent>
                </Card>
            </Collapse>
        </React.Fragment>

    )
}