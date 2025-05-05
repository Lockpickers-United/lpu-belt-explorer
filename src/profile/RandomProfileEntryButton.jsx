import CasinoIcon from '@mui/icons-material/Casino'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import DataContext from '../locks/LockDataProvider.jsx'

function RandomProfileEntryButton({onSelect}) {
    const {visibleEntries = []} = useContext(DataContext)

    const handleClick = useCallback(() => {
        // TODO: fix to handle unranked locks better
        const index = Math.floor(Math.random() * visibleEntries.length)
        const entry = visibleEntries[index]
        onSelect(entry.id)
    }, [visibleEntries, onSelect])

    useHotkeys('r', () => handleClick(), {preventDefault: true})

    return (
        <Tooltip title='Random Lock' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <CasinoIcon style={{color:'#999'}}/>
            </IconButton>
        </Tooltip>
    )
}

export default RandomProfileEntryButton
