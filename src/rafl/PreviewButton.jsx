import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import AppContext from '../app/AppContext.jsx'

function PreviewButton() {
    const {preview, setPreview} = useContext(AppContext)
    const togglePreview = useCallback(() => setPreview(!preview), [preview, setPreview])

    useHotkeys('p', () => togglePreview(), {preventDefault: true})

    const color = preview ? '#d00' : '#fff'

    return (
        <Tooltip title='Toggle Preview Mode' arrow disableFocusListener>
            <IconButton onClick={togglePreview} style={{height:48, width:48}}>
                <VisibilityIcon style={{color:color}}/>
            </IconButton>
        </Tooltip>
    )
}

export default PreviewButton
