import React, {useContext} from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import FilterDisplay from './FilterDisplay'
import FilterContext from '../contexts/FilterContext'
import ClearFiltersButton from './ClearFiltersButton'
import useWindowSize from '../util/useWindowSize'

function InlineFilterDisplay() {
    const {filterCount} = useContext(FilterContext)
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    if (!filterCount) return null
    return (
        <Card style={style}>
            <CardContent>
                <FilterDisplay/>
            </CardContent>
            <CardActions>
                <div style={{width: '100%'}}/>
                <ClearFiltersButton/>
            </CardActions>
        </Card>
    )
}

export default InlineFilterDisplay
