import React, {useContext} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FilterContext from '../contexts/FilterContext'
import useWindowSize from '../util/useWindowSize'

function InlineDisplaySpacer() {
    const {filterCount} = useContext(FilterContext)
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    if (!filterCount) return null
    return (
        <Card style={style} sx={{paddingBottom:0, borderRadius: 0}}>
            <CardContent style={{paddingBottom:0}}/>
        </Card>
    )
}

export default InlineDisplaySpacer
