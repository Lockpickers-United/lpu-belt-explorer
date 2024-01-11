import React, {useCallback} from 'react'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useNavigate} from 'react-router-dom'

function LeaderboardFindMeButton() {
    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        navigate('/leaderboard?user=me')
    }, [navigate])

    return (
        <Tooltip title='Find Me' arrow disableFocusListener>
            <IconButton color='inherit' onClick={handleClick}>
                <PersonSearchIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default LeaderboardFindMeButton
