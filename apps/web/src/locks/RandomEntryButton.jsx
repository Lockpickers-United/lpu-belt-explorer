import CasinoIcon from '@mui/icons-material/Casino'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import DataContext from './LockDataProvider'
import {useNavigate} from 'react-router-dom'

function RandomEntryButton({onSelect}) {
    const {visibleEntries} = useContext(DataContext)
    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        // TODO: fix to handle unranked locks better
        const index = Math.floor(Math.random() * visibleEntries.length)
        const entry = visibleEntries[index]
        navigate(`/locks?id=${entry.id}`)
        onSelect(entry.id)
    }, [visibleEntries, navigate, onSelect])

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
