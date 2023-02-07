import React, {useContext} from 'react'
import {Card, CardContent} from '@mui/material'
import FilterDisplay from './FilterDisplay.jsx'
import FilterContext from './FilterContext.jsx'
import {useMediaQuery} from 'react-responsive'

function InlineFilterDisplay() {
    const {filterCount} = useContext(FilterContext)
    const isBigEnough = useMediaQuery({minWidth: 732})
    const style = isBigEnough
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
        : {maxWidth: 700, marginLeft: 8, marginRight: 8}

    if (!filterCount) return null
    return (
        <Card style={style}>
            <CardContent >
                <FilterDisplay/>
            </CardContent>
        </Card>
    )
}

export default InlineFilterDisplay
