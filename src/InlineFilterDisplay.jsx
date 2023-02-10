import React, {useContext} from 'react'
import {Card, CardActions, CardContent} from '@mui/material'
import FilterDisplay from './FilterDisplay.jsx'
import FilterContext from './FilterContext.jsx'
import {useMediaQuery} from 'react-responsive'
import IconButton from '@mui/material/IconButton'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'

function InlineFilterDisplay({onChangeTab}) {
    const {filters, filterCount, clearFilters} = useContext(FilterContext)
    const isBigEnough = useMediaQuery({minWidth: 732})
    const style = isBigEnough
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
        : {maxWidth: 700, marginLeft: 8, marginRight: 8}

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
