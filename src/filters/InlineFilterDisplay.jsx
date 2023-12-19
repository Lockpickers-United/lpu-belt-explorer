import React, {useContext} from 'react'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import AuthContext from '../contexts/AuthContext'
import FilterDisplay from './FilterDisplay'
import FilterContext from '../contexts/FilterContext'
import ClearFiltersButton from './ClearFiltersButton'
import useWindowSize from '../util/useWindowSize'

function InlineFilterDisplay() {
    const {isLoggedIn} = useContext(AuthContext)
    const {filters, filterCount} = useContext(FilterContext)

    const {collection} = filters
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700, borderRadius: 0}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    let currentCollection = ''
    if (filters && filters.collection) {
        if (typeof filters.collection === 'string') {
            currentCollection = filters.collection
        } else {
            currentCollection = filters.collection[0]
        }
    }

    let header
    if (isLoggedIn && typeof collection === 'string') {
        header = <CardHeader title='My Collection' style={{}}/>
    }

    if (!filterCount) return null
    if (currentCollection && currentCollection.match(/^(Own|Picked|Recorded|Wishlist)$/) && filterCount === 1)
        return (
            <Card style={style} sx={{padding: '16px 0px 8px 8px'}}>
                <CardContent style={{fontSize: '1.48rem', paddingBottom: 0, paddingTop: 0, float: 'left'}}>
                    <span style={{fontWeight: 500}}>My Collection</span>
                </CardContent>
                <CardActions style={{paddingTop: 0, marginRight: '8px', float: 'right'}}>
                    {filterCount < 2 &&
                        <ClearFiltersButton/>
                    }
                </CardActions>
            </Card>
        )

    return (
        <Card style={style} sx={{paddingBottom: 0, paddingTop: 0}}>
            {header}
            <CardContent style={{paddingBottom: 0, paddingTop: 0}}>
                <FilterDisplay/>
            </CardContent>
            <CardActions style={{padding: '8px 16px 16px 16px'}}>
                <div style={{width: '100%'}}/>
                <ClearFiltersButton/>
            </CardActions>
        </Card>
    )
}

export default InlineFilterDisplay
