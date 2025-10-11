import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import Button from '@mui/material/Button'
import useWindowSize from '../util/useWindowSize'
import FilterContext from '../context/FilterContext'

export default function ResetFiltersButton({forceText, forceIcon, closeDrawer, alwaysShow}) {
    const {isMobile} = useWindowSize()
    const {filterCount, clearFilters, setAdvancedFilterGroups, setShowAdvancedSearch} = useContext(FilterContext)

    const handleReset = useCallback(() => {
        clearFilters()
        setAdvancedFilterGroups && setAdvancedFilterGroups([])
        setShowAdvancedSearch && setShowAdvancedSearch(false)
        closeDrawer && closeDrawer()
    },[clearFilters, closeDrawer, setAdvancedFilterGroups, setShowAdvancedSearch])

    if (filterCount === 0 && !alwaysShow) return null
    if ((isMobile && !forceText) || forceIcon) {
        return (
            <Tooltip title='Reset All' arrow disableFocusListener>
                <IconButton onClick={handleReset} color='warning' style={{padding:0}}>
                    <CancelIcon/>
                </IconButton>
            </Tooltip>
        )
    } else {
        return (
            <Button color='warning' onClick={handleReset} style={{minWidth: 80, marginLeft:8}}>
                Reset
            </Button>
        )
    }
}