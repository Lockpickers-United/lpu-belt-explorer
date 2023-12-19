import React, {useCallback, useContext} from 'react'
import Tooltip from '@mui/material/Tooltip'
import ViewListIcon from '@mui/icons-material/ViewList'
import IconButton from '@mui/material/IconButton'
import AppContext from '../contexts/AppContext'

function ToggleCompactButton() {
    const {compact, setCompact} = useContext(AppContext)

    const handleClick = useCallback(() => {
        setCompact(!compact)
    }, [compact, setCompact])

    return (
        <Tooltip title='Toggle Compact View' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <ViewListIcon color={compact ? 'secondary' : 'inherit'}/>
            </IconButton>
        </Tooltip>
    )
}

export default ToggleCompactButton
