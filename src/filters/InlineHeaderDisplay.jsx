import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import DBContext from '../contexts/DBContext'
import FilterContext from '../contexts/FilterContext'
import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize'
import SortButton from './SortButton'
import AuthContext from '../contexts/AuthContext'
import UserMenu from '../nav/UserMenu'

function InlineHeaderDisplay() {
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const {isLoggedIn} = useContext(AuthContext)
    const {filters} = useContext(FilterContext)
    const {lockCollection} = useContext(DBContext)
    let currentCollection = ''

    if (filters && filters.collection) {
        currentCollection = typeof filters.collection === 'string' ? filters.collection : filters.collection[0]
    }

    if (!currentCollection) return null
    if (currentCollection.includes('Not') || currentCollection.includes('Don\'t')) return null

    const collectionName = currentCollection === 'Own' ? 'Owned' : currentCollection
    const collectionHeader = isLoggedIn ? `${collectionName} (${lockCollection[currentCollection.toLowerCase()]?.length})` : 'Sign in to view'

    return (
        <Card style={style} sx={{borderRadius: 0}}>
            <CardContent style={{fontSize: '1.48rem', paddingBottom: 0, paddingTop: 0, float: 'left'}}>
                <span style={{fontWeight: 500}}>Collection:</span> {collectionHeader}
            </CardContent>
            <CardActions style={{paddingTop: 0, paddingBottom: 0, height: 40, float: 'right'}}>
                {isLoggedIn &&
                    <SortButton/>
                }
                {!isLoggedIn &&
                    <UserMenu/>
                }
            </CardActions>
        </Card>
    )
}

export default InlineHeaderDisplay
