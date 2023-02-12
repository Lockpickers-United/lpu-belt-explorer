import React, {useContext} from 'react'
import {Card, CardActions, CardContent} from '@mui/material'
import FilterDisplay from './FilterDisplay.jsx'
import FilterContext from './FilterContext.jsx'
import IconButton from '@mui/material/IconButton'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'

function InlineFilterDisplay({onChangeTab, isMobile}) {
    const {filters, filterCount, clearFilters} = useContext(FilterContext)
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 8, marginRight: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const handleClear = () => {
        if (!filters.search) onChangeTab('white')
        setTimeout(() => clearFilters(), 0)
    }

    if (!filterCount) return null
    return (
        <Card style={style}>
            <CardContent>
                <FilterDisplay/>
            </CardContent>
            <CardActions>
                <div style={{width: '100%'}}/>
                <IconButton onClick={handleClear}>
                    <FilterAltOffIcon/>
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default InlineFilterDisplay
