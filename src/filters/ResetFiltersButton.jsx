import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import Button from '@mui/material/Button'
import useWindowSize from '../util/useWindowSize'
import FilterContext from '../context/FilterContext'

export default function ResetFiltersButton({
                                               forceText,
                                               forceIcon,
                                               closeDrawer,
                                               alwaysShow,
                                               drawer = false,
                                               nav = false
                                           }) {
    const {isMobile} = useWindowSize()
    const {filterCount, clearFilters, clearAdvancedFilterGroups} = useContext(FilterContext)

    const handleReset = useCallback(() => {
        clearFilters()
        clearAdvancedFilterGroups && clearAdvancedFilterGroups()
        closeDrawer && closeDrawer()
    }, [clearAdvancedFilterGroups, clearFilters, closeDrawer])

    const buttonVariant = drawer
        ? 'text'
        : nav
            ? 'text'
            : 'outlined'

    const buttonStyle = nav
        ? {marginLeft: 2}
        : {height: 28, padding: '0px 12px', minWidth: 80, marginLeft: 8}

    if (filterCount === 0 && !alwaysShow) return null
    if ((isMobile && !forceText) || forceIcon) {
        return (
            <Tooltip title='Reset All' arrow disableFocusListener>
                <IconButton onClick={handleReset} color='warning' style={{padding: 0}}>
                    <CancelIcon/>
                </IconButton>
            </Tooltip>
        )
    } else {
        return (
            <Button variant={buttonVariant} color='warning' onClick={handleReset}
                    style={buttonStyle}>
                Reset
            </Button>
        )
    }
}