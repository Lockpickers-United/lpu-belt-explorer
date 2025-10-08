import React, {useCallback, useContext} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import AdvancedFilterField from './AdvancedFilterField.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import FilterContext from '../context/FilterContext.jsx'
import Button from '@mui/material/Button'

export default function AdvancedSearch() {
    const {clearFilters, advancedFilterGroups, setAdvancedFilterGroups, showAdvancedSearch} = useContext(FilterContext)

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, borderRadius: 0}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    const addFilter = useCallback(() => {
        const next = [...advancedFilterGroups(), { _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, fieldName: '', matchType: 'Is', operator: 'OR', values: []}]
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
        const next = groups.filter((_, i) => i !== idx)
        setAdvancedFilterGroups(next)
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    return (
        <React.Fragment>
            {showAdvancedSearch &&
                <Card style={style} sx={{paddingBottom: 2, paddingTop: 2}}>
                    <CardContent style={{paddingTop: 0, paddingLeft: 16}}>

                        <div style={{fontWeight: 700, fontSize: '1.1rem'}}>Advanced Search</div>

                        <div
                            style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
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

                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 24}}>
                            {advancedFilterGroups().length > 0 && (
                                <Button onClick={handleClearAll} variant='contained' size='small'
                                        style={{backgroundColor: '#444', marginRight: 16}}>
                                    Clear All</Button>
                            )}
                            <Button onClick={addFilter} variant='contained' color='info' size='small'>Add
                                Filter</Button>
                        </div>

                    </CardContent>
                </Card>
            }
        </React.Fragment>
    )
}