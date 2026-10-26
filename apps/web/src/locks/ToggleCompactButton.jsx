import React, {useCallback, useContext} from 'react'
import Tooltip from '@mui/material/Tooltip'
import ViewListIcon from '@mui/icons-material/ViewList'
import IconButton from '@mui/material/IconButton'
import LockListContext from './LockListContext'

function ToggleCompactButton() {
    const {compact, setCompact, setExpanded} = useContext(LockListContext)

    const handleClick = useCallback(() => {
        setCompact(!compact)
        setExpanded(null)
    }, [compact, setCompact, setExpanded])

    return (
        <Tooltip title='Toggle Compact View' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <ViewListIcon color={compact ? 'secondary' : 'inherit'}/>
            </IconButton>
        </Tooltip>
    )
}

export default ToggleCompactButton
