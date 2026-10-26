import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import CachedIcon from '@mui/icons-material/Cached'

export default function RefreshButton({handleClick, title = 'Refresh', iconOnly = false}) {


    return (
        <Tooltip title={'Refresh'} arrow disableFocusListener>
            {!iconOnly
                ? <Button variant='outlined' size='small' onClick={handleClick}
                          style={{color: '#ddd', borderColor: '#aaa'}} startIcon={<CachedIcon/>}>
                    {title}
                </Button>
                : <IconButton onClick={handleClick}>
                    <CachedIcon/>
                </IconButton>
            }
        </Tooltip>
    )
}

