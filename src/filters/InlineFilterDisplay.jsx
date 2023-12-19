import React, {useContext} from 'react'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import AuthContext from '../contexts/AuthContext'
import DBContext from '../contexts/DBContext'
import FilterDisplay from './FilterDisplay'
import FilterContext from '../contexts/FilterContext'
import ClearFiltersButton from './ClearFiltersButton'
import useWindowSize from '../util/useWindowSize'

function InlineFilterDisplay() {
    const {isLoggedIn} = useContext(AuthContext)
    const {filters, filterCount} = useContext(FilterContext)
    const {lockCollection} = useContext(DBContext)

    const {collection} = filters
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    let header
    if (isLoggedIn && typeof collection === 'string') {
        const title = `Collection: ${collection} (${lockCollection[collection.toLowerCase()]?.length || 0})`
        header = <CardHeader title={title}/>
    }

    if (!filterCount) return null
    return (
        <Card style={style} sx={{paddingBottom: 0, paddingTop: 0, borderRadius: 0}}>
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
