import IconButton from '@mui/material/IconButton'
import React, {useCallback, useContext, useMemo} from 'react'
import Tooltip from '@mui/material/Tooltip'
import AppContext from '../contexts/AppContext'
import DataContext from '../contexts/DataContext'
import FilterContext from '../contexts/FilterContext'
import BeltIcon from './BeltIcon'

function RelatedEntryButton({id}) {
    const {setExpanded} = useContext(AppContext)
    const {getEntryFromId, getNameFromId, visibleEntries} = useContext(DataContext)
    const {setFilters} = useContext(FilterContext)
    const entry = useMemo(() => getEntryFromId(id), [getEntryFromId, id])

    const handleClick = useCallback(async () => {
        if (!visibleEntries.some(e => e.id === id)) {
            const name = getNameFromId(id)
            setFilters({id, name, tab: entry.belt.replace(/\s\d/g, '')})
            setExpanded(id)
        } else {
            setExpanded(id)
        }
    }, [visibleEntries, id, getNameFromId, setFilters, entry.belt, setExpanded])

    return (
        <Tooltip title={entry.version} arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <BeltIcon value={entry.belt}/>
            </IconButton>
        </Tooltip>
    )
}

export default RelatedEntryButton
