import IconButton from '@mui/material/IconButton'
import React, {useCallback, useContext, useMemo} from 'react'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../locks/LockDataProvider'
import FilterContext from '../context/FilterContext'
import BeltIcon from './BeltIcon'

function RelatedEntryButton({id, onExpand}) {
    const {getEntryFromId, visibleEntries} = useContext(DataContext)
    const {addFilters} = useContext(FilterContext)
    const entry = useMemo(() => getEntryFromId(id), [getEntryFromId, id])

    const handleClick = useCallback(async () => {
        if (!visibleEntries.some(e => e.id === id)) {
            addFilters([{tab: entry.belt.replace(/\s\d/g, '')}])
        }
        onExpand(id)
    }, [visibleEntries, id, addFilters, entry.belt, onExpand])

    return (
        <Tooltip title={entry.version} arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <BeltIcon value={entry.belt}/>
            </IconButton>
        </Tooltip>
    )
}

export default RelatedEntryButton
