import SortTextButton from './SortTextButton.jsx'
import FilterTextButton from './FilterTextButton.jsx'
import Button from '@mui/material/Button'
import React, {useCallback, useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import FilterContext from '../context/FilterContext.jsx'
import Box from '@mui/material/Box'

function ViewFilterButtons({sortValues, extraFilters = [], compactMode, resetAll=false}) {

    const {filters, filterCount, setFilters} = useContext(FilterContext)
    const {tab, sort, search} = filters

    const reset = sort || filterCount > 0 || (search && resetAll)
    const handleReset = useCallback(() => {
        const savedFilters = resetAll ? {tab: tab} : {tab: tab, search: search}
        setFilters(savedFilters)
    }, [resetAll, search, setFilters, tab])

    const {width} = useWindowSize()
    const smallWidth = width <= 500

    const buttonPaddingTop = !smallWidth ? 0 : 3
    const buttonMarginBottom = !smallWidth ? 0 : 2
    const buttonWidth = !smallWidth ? 60 : 40

    return (
        <Box style={{
            display: 'flex',
            paddingTop: buttonPaddingTop,
            marginBottom: buttonMarginBottom,
            marginLeft: 0,
            justifyContent: 'center'
        }}
             sx={{
                 '.MuiBadge-anchorOriginTopRightRectangular': {
                     marginTop: '5px'
                 },
                 '.MuiButton-root': {
                     minWidth: buttonWidth
                 }
             }}
        >
            <SortTextButton sortValues={sortValues} compactMode={compactMode}/>
            <FilterTextButton extraFilters={extraFilters}/>
            {reset &&
                <Button color='inherit' style={{color: '#bbb'}} onClick={handleReset}>
                    RESET</Button>
            }
        </Box>
    )
}

export default ViewFilterButtons