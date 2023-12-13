import React, {useContext} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FilterContext from '../contexts/FilterContext'
import useWindowSize from '../util/useWindowSize'

console.log('InlineSpacerDisplay start')

function InlineDisplaySpacer() {
    const {filterCount} = useContext(FilterContext)
    const {width} = useWindowSize()
    const style = width < 736
        ? {maxWidth: 700}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    if (!filterCount) return null
    return (
        <Card style={style} sx={{paddingBottom:"0px"}}>
            <CardContent style={{paddingBottom:"0px"}}/>
        </Card>
    )
}
console.log('InlineSpacerDisplay end')

export default InlineDisplaySpacer
