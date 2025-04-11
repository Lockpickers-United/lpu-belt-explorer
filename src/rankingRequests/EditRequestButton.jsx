import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function EditRequestButton({requestMod, handleClick}) {

    return requestMod
        ? (
            <Tooltip title='Edit Request' arrow disableFocusListener>
                <IconButton onClick={handleClick} style={{height: 38, width: 38, marginTop:'auto', marginBottom: 'auto'}}>
                    <EditIcon style={{height: 20, width: 20}}/>
                </IconButton>
            </Tooltip>
        )
        : null
}

export default EditRequestButton
