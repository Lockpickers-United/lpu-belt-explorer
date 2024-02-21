import IconButton from '@mui/material/IconButton'
import React, {useCallback, useContext, useMemo} from 'react'
import Tooltip from '@mui/material/Tooltip'
import LockListContext from '../locks/LockListContext'
import DataContext from '../locks/LockDataProvider'
import FilterContext from '../context/FilterContext'
import BeltIcon from './BeltIcon'

function RelatedEntryButton({id}) {
    const {setExpanded} = useContext(LockListContext)
    const {getEntryFromId, getNameFromId, visibleEntries} = useContext(DataContext)
    const {addFilters} = useContext(FilterContext)
    const entry = useMemo(() => getEntryFromId(id), [getEntryFromId, id])

    const handleClick = useCallback(async () => {
        if (!visibleEntries.some(e => e.id === id)) {
            const name = getNameFromId(id)
            addFilters({id, name, tab: entry.belt.replace(/\s\d/g, '')})
            setExpanded(id)
        } else {
            setExpanded(id)
        }
    }, [visibleEntries, id, getNameFromId, addFilters, entry.belt, setExpanded])

    return (
        <Tooltip title={entry.version} arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <BeltIcon value={entry.belt}/>
            </IconButton>
        </Tooltip>
    )
}

export default RelatedEntryButton
