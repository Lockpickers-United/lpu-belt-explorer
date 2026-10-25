import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import WysiwygIcon from '@mui/icons-material/Wysiwyg'
import entryName from './entryName'
import {jsonIt} from '../util/jsonIt'
import {useAccess} from '../app/AccessContext.jsx'

export default function LogEntryButton({entry}) {
    const {accessInfo} = useAccess()

    const handleClick = useCallback(async () => {
        const name =  entryName(entry)
        jsonIt(name, entry)
    }, [entry])

    if (!accessInfo.features.qaTools) return null

    return (
        <Tooltip title='Log Entry Details' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <WysiwygIcon style={{color: '#434380'}}/>
            </IconButton>
        </Tooltip>
    )
}