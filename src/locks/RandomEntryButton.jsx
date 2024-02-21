import CasinoIcon from '@mui/icons-material/Casino'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import LockListContext from './LockListContext'
import DataContext from './LockDataProvider'

function RandomEntryButton() {
    const {setExpanded} = useContext(LockListContext)
    const {visibleEntries} = useContext(DataContext)

    const handleClick = useCallback(() => {
        // TODO: fix to handle unranked locks better
        const index = Math.floor(Math.random() * visibleEntries.length)
        const entry = visibleEntries[index]
        setExpanded(entry.id, true)
    }, [setExpanded, visibleEntries])

    useHotkeys('r', () => handleClick(), {preventDefault: true})

    return (
        <Tooltip title='Random Lock' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <CasinoIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default RandomEntryButton
