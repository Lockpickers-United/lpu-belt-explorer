import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import React, {useCallback, useState} from 'react'

export default function DeleteButton({onClick, disabled, style, variant='text', size='small', color = 'error', children}) {

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const handleDelete = useCallback(() => {
        handleClose()
        onClick && onClick()
    }, [onClick, handleClose])

    return (
        <div>
            <Button
                onClick={handleOpen}
                style={style}
                disabled={disabled}
                variant={variant}
                size={size}
                color={color}
                edge='start'
            >
                Delete
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <div style={{padding: 20, textAlign: 'center'}}>
                    You cannot undo delete.<br/>
                    Are you sure?
                </div>
                <div style={{textAlign: 'center'}}>
                    <Button style={{marginBottom: 10, color: '#000'}}
                            variant='contained'
                            onClick={handleDelete}
                            edge='start'
                            color='error'
                    >
                        {children}
                    </Button>
                </div>
            </Menu>
        </div>
    )
}