import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import WysiwygIcon from '@mui/icons-material/Wysiwyg'
import entryName from './entryName'
import {jsonIt} from '../util/jsonIt'
import DBContext from '../app/DBContext.jsx'

export default function LogEntryButton({entry}) {

    const {adminRole} = useContext(DBContext)

    const handleClick = useCallback(async () => {
        const name =  entryName(entry)
        jsonIt(name, entry)
    }, [entry])

    if (!adminRole) return null

    return (
        <Tooltip title='Log Entry Details' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <WysiwygIcon color='primary'/>
            </IconButton>
        </Tooltip>
    )
}