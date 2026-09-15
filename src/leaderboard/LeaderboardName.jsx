import React from 'react'
import {styled} from '@mui/material/styles'

const LeaderLink = styled('a')({
    textDecoration: 'none',
    color: '#fff',
    '&:hover': {
        color: '#777'
    }
})

function LeaderboardName({leader, isCurrentUser, tab, maxLength}) {

    const style = isCurrentUser ? {color: '#4db013'} : {}

    const leaderName = leader.displayName && leader.displayName.length > maxLength
        ? leader.displayName = leader.displayName.slice(0, maxLength) + '...'
        : leader.displayName

    if (leader.displayName && !leader.privacyAnonymous) {
        const safeName = leader.displayName.replace(/\s/g, '_')
        const id = leader.id || leader.userId
        const href = tab === 'blackBelts'
            ? `/#/profile/${id}/scorecard?name=${safeName}`
            : tab === 'safelocks'
                ? `/#/profile/${id}/safelocks?name=${safeName}`
                : `/#/profile/${id}?name=${safeName}`

        return <LeaderLink style={style} href={href}>{leaderName}</LeaderLink>
    } else {
        return 'Anonymous'
    }
}

export default LeaderboardName
