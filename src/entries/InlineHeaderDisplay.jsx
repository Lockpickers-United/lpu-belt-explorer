import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import DBContext from '../contexts/DBContext'
import ExportButton from '../misc/ExportButton'
import FilterContext from '../contexts/FilterContext'
import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize'

function InlineHeaderDisplay() {
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const {lockCollection} = useContext(DBContext)
    const {filters} = useContext(FilterContext)

    let currentCollection = ''
    if (filters && filters.collection) {
        if (typeof filters.collection === 'string') {
            currentCollection = filters.collection
        } else {
            currentCollection = filters.collection[0]
        }
    }

    if (!currentCollection) return null
    if (currentCollection.includes('Not') || currentCollection.includes("Don't")) return null
    //if (filterCount > 1) return null

    const collectionName = currentCollection === 'Own' ? 'Owned' : currentCollection

    return (
        <Card style={style} sx={{borderRadius: 0}}>
            <CardContent style={{fontSize: '1.48rem', paddingBottom: 0, paddingTop: 0, float: 'left'}}>
                <span
                    style={{fontWeight: 500}}>Collection:</span> {collectionName} ({lockCollection[currentCollection.toLowerCase()]?.length})
            </CardContent>
            <CardActions style={{paddingTop: 0, float: 'right'}}>
                {/*<ExportButton/>*/}
            </CardActions>
        </Card>
    )
}

export default InlineHeaderDisplay
