import React, {useContext} from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import FilterDisplay from './FilterDisplay'
import FilterContext from '../contexts/FilterContext'
import ClearFiltersButton from './ClearFiltersButton'
import useWindowSize from '../util/useWindowSize'
import DBContext from "../contexts/DBContext.jsx";

function InlineFilterDisplay() {
    const {filterCount} = useContext(FilterContext)
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    let currentCollection = ''
    const {filters} = useContext(FilterContext)
    if (filters && filters.collection) {
        if (typeof filters.collection === 'string') {
            currentCollection = filters.collection
        } else {
            currentCollection = filters.collection[0]
        }
    }

    if (!filterCount) return null
    if (currentCollection) return null
    if (currentCollection.includes('Not') || currentCollection.includes("Don't")) return null

    return (
        <Card style={style} sx={{paddingBottom: 0, paddingTop: 0, borderRadius: 0}}>
            <CardContent style={{paddingBottom: 0, paddingTop: 0}}>
                <FilterDisplay/>
            </CardContent>
            <CardActions style={{padding: "8px 16px 16px 16px"}}>
                <div style={{width: '100%'}}/>
                <ClearFiltersButton/>
            </CardActions>
        </Card>
    )
}

export default InlineFilterDisplay
