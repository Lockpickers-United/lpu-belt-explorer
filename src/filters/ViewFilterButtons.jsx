import SortTextButton from './SortTextButton.jsx'
import FilterTextButton from './FilterTextButton.jsx'
import Button from '@mui/material/Button'
import React, {useCallback, useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import FilterContext from '../context/FilterContext.jsx'
import Box from '@mui/material/Box'
import CancelIcon from '@mui/icons-material/Cancel'

function ViewFilterButtons({sortValues, extraFilters = [], compactMode, resetAll=false, expandAll=false, style}) {

    const {filters, filterCount, setFilters, isFiltered} = useContext(FilterContext)
    const {tab, sort, search} = filters

    const reset = sort || filterCount > 0 || (isFiltered && resetAll)
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
            justifyContent: 'center',
            ...style
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
            <SortTextButton sortValues={sortValues} compactMode={compactMode} expandAll={expandAll}/>
            <FilterTextButton extraFilters={extraFilters}/>
            {reset &&
                <Button color='inherit' style={{color: '#bbb'}} onClick={handleReset}>
                    { !smallWidth ? 'RESET' : <CancelIcon/> }
                </Button>
            }
        </Box>
    )
}

export default ViewFilterButtons