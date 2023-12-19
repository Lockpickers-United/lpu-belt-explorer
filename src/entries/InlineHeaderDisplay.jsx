import React, {useContext} from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import FilterContext from '../contexts/FilterContext'
import useWindowSize from '../util/useWindowSize'
import ClearFiltersButton from '../filters/ClearFiltersButton.jsx'

function InlineHeaderDisplay() {
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const {filters} = useContext(FilterContext)
    const {filterCount} = useContext(FilterContext)

    let currentCollection = ''
    if (filters && filters.collection) {
        if (typeof filters.collection === 'string') {
            currentCollection = filters.collection
        } else {
            currentCollection = filters.collection[0]
        }
    }

    if (!currentCollection) return null
    if (!currentCollection.match(/^(Own|Picked|Recorded|Wishlist)$/)) return null
    return (
        <Card style={style} sx={{borderRadius: 0}}>
            <CardContent style={{fontSize: '1.48rem', paddingBottom: 0, paddingTop: 0, float: 'left'}}>
                <span style={{fontWeight: 500}}>My Collection</span>
            </CardContent>
            <CardActions style={{paddingTop: 0, float: 'right'}}>
                {filterCount < 2 &&
                    <ClearFiltersButton/>
                }
            </CardActions>
        </Card>
    )
}

export default InlineHeaderDisplay
