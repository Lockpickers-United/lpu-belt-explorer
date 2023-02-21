import React, {useContext} from 'react'
import {Card, CardActions, CardContent} from '@mui/material'
import FilterDisplay from './FilterDisplay.jsx'
import FilterContext from './FilterContext.jsx'
import ClearFiltersButton from './ClearFiltersButton.jsx'

function InlineFilterDisplay({tab, onChangeTab, isMobile}) {
    const {filterCount} = useContext(FilterContext)
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 8, marginRight: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    if (!filterCount) return null
    return (
        <Card style={style}>
            <CardContent>
                <FilterDisplay/>
            </CardContent>
            <CardActions>
                <div style={{width: '100%'}}/>
                <ClearFiltersButton tab={tab} onChangeTab={onChangeTab}/>
            </CardActions>
        </Card>
    )
}

export default InlineFilterDisplay
