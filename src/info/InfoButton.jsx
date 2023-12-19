import React, {useCallback} from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {useNavigate} from 'react-router-dom'

function InfoButton({icon, active}) {
    const navigate = useNavigate()

    const handleClick = useCallback(url => () => {
        navigate(url)
    }, [navigate])

    const button = icon
        ? (
            <IconButton color='inherit' onClick={handleClick('/info')}>
                <InfoOutlinedIcon/>
            </IconButton>
        )
        : (
            <Button color='inherit' onClick={handleClick('/info')}>
                Read more...
            </Button>
        )

    if (active) {
        return (
            <InfoOutlinedIcon color='secondary'/>
        )
    } else {
        return (
            <React.Fragment>
                <Tooltip title='Information' arrow disableFocusListener>
                    {button}
                </Tooltip>
            </React.Fragment>
        )
    }
}

export default InfoButton
