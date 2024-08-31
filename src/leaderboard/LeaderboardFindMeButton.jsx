import React, {useCallback, useContext} from 'react'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'

function LeaderboardFindMeButton({tab}) {
    const navigate = useNavigate()
    const {isLoggedIn, user} = useContext(AuthContext)

    const handleClick = useCallback(() => {
        navigate(`/leaderboard/${tab}?user=me`)
    }, [navigate, tab])

    if (!isLoggedIn || user?.privacyNoLeaderboard) return null
    return (
        <Tooltip title='Find Me' arrow disableFocusListener>
            <IconButton color='inherit' onClick={handleClick}>
                <PersonSearchIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default LeaderboardFindMeButton
