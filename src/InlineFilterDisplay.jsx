import React, {useContext} from 'react'
import {Card, CardActions, CardContent} from '@mui/material'
import FilterDisplay from './FilterDisplay.jsx'
import FilterContext from './FilterContext.jsx'
import Button from '@mui/material/Button'

function InlineFilterDisplay({tab, onChangeTab, isMobile}) {
    const {filters, filterCount, clearFilters} = useContext(FilterContext)
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 8, marginRight: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const handleClear = () => {
        if (!filters.search && tab === 'search') onChangeTab('white')
        setTimeout(() => clearFilters(), 0)
    }

    if (!filterCount) return null
    return (
        <Card style={style}>
            <CardContent>
                <FilterDisplay/>
            </CardContent>
            <CardActions>
                <div style={{width: '100%'}}/>
                <Button variant='outlined' color='inherit' onClick={handleClear}>
                    Clear&nbsp;Filters
                </Button>
            </CardActions>
        </Card>
    )
}

export default InlineFilterDisplay
