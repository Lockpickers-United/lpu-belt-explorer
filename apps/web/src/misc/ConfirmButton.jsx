import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import React, {useCallback, useState} from 'react'

export default function ConfirmButton({onClick, message='',disabled, style, variant='text', size='small', color = 'error', children}) {

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const handleClick = useCallback(() => {
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
            >
                {children}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <div style={{padding: 20, textAlign: 'center'}}>
                    {message}<br/>
                    Are you sure?
                </div>
                <div style={{textAlign: 'center'}}>
                    <Button style={{marginBottom: 10, color: '#000'}}
                            variant='contained'
                            onClick={handleClick}
                            size={size}
                            color={color}
                    >
                        {children}
                    </Button>
                </div>
            </Menu>
        </div>
    )
}