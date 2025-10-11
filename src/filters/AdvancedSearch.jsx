import React, {useCallback, useContext, useEffect} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import AdvancedFilterField from './AdvancedFilterField.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import FilterContext from '../context/FilterContext.jsx'
import Button from '@mui/material/Button'
import DataContext from '../context/DataContext.jsx'
import Link from '@mui/material/Link'
import {Collapse} from '@mui/material'
import queryString from 'query-string'
import {useLocation} from 'react-router-dom'
import InlineFilterDisplay from './InlineFilterDisplay.jsx'
import FilterScopeToggle from './FilterScopeToggle.jsx'

export default function AdvancedSearch({profile, collectionType, advancedEnabled}) {
    const {
        advancedFilterGroups,
        setAdvancedFilterGroups,
        showAdvancedSearch,
        setShowAdvancedSearch,
        removeFilters,
        clearFilters
    } = useContext(FilterContext)
    const {beltEntries = []} = useContext(DataContext)

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

    const handleToggleAdvanced = useCallback(() => {
        setShowAdvancedSearch(!showAdvancedSearch)
    }, [setShowAdvancedSearch, showAdvancedSearch])

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
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, borderRadius: 0}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    const paddingLeft = isMobile ? 8 : 16

    const linkSx = {
        color: '#ddd', textDecoration: 'underline', cursor: 'pointer', '&:hover': {
            color: '#fff'
        }
    }

    return (
        <React.Fragment>
            {!showAdvancedSearch &&
                <InlineFilterDisplay profile={profile} collectionType={collectionType}
                                     advancedEnabled={advancedEnabled}/>
            }
            <Collapse in={showAdvancedSearch} unmountOnExit={true}>
                <Card style={style} sx={{paddingBottom: 2, paddingTop: 2}}>
                    <CardContent style={{paddingTop: 0, paddingLeft: paddingLeft}}>

                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{fontWeight: 700, fontSize: '1.2rem'}}>Advanced Search</div>
                            {beltEntries.length > 1 &&
                                <div style={{
                                    fontWeight: 400,
                                    fontSize: '1.0rem',
                                    marginLeft: 8
                                }}>({beltEntries.length} Locks)</div>
                            }
                            <div style={{flexGrow: 1, textAlign: 'right', fontSize: '0.9rem'}}>
                                <Link onClick={handleToggleAdvanced} sx={linkSx}>Close</Link>
                            </div>
                        </div>

                        <FilterScopeToggle style={{margin: '16px 0px 16px 0px'}}/>

                        <div
                            style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
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

                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 8}}>
                            <Button onClick={handleClearAll} variant='contained' size='small'
                                    style={{backgroundColor: '#444', marginRight: 16}}>
                                Clear All</Button>
                            <Button onClick={addFilter} variant='contained' color='info' size='small'>Add
                                Filter</Button>
                        </div>

                    </CardContent>
                </Card>
            </Collapse>
        </React.Fragment>

    )
}