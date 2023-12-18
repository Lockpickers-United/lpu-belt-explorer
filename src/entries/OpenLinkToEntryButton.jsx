import React, {useCallback, useContext, useMemo} from 'react'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../contexts/DataContext'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AppContext from '../contexts/AppContext'
import FilterContext from '../contexts/FilterContext'
import IconButton from '@mui/material/IconButton'

function OpenLinkToEntryButton({id}) {
    const {setExpanded, setExpandedDirect} = useContext(AppContext)
    const {getEntryFromId, getNameFromId, visibleEntries} = useContext(DataContext)
    const {setFilters} = useContext(FilterContext)
    const entry = useMemo(() => getEntryFromId(id), [getEntryFromId, id])

    const handleClick = useCallback(async () => {
        if (id) {
            const name = getNameFromId(id)
            setFilters({id, name, tab: entry.belt.replace(/\s\d/g, '')})
            setExpandedDirect(id)
        }
    }, [visibleEntries, id, getNameFromId, setFilters, entry.belt, setExpanded, setExpandedDirect])

    return (
        <Tooltip title='View Full Entry' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <OpenInNewIcon fontSize='small'/>
            </IconButton>
        </Tooltip>
    )
}

export default OpenLinkToEntryButton
