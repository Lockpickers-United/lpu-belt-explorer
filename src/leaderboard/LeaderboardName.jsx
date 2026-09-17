import React, {useContext} from 'react'
import {styled} from '@mui/material/styles'
import DBContext from '../app/DBContext.jsx'

const LeaderLink = styled('a')({
    textDecoration: 'none',
    color: '#fff',
    '&:hover': {
        color: '#777'
    }
})

function LeaderboardName({leader, isCurrentUser, tab, maxLength}) {
    const {lockCollection} = useContext(DBContext)

    console.log('leader', leader)
    const style = isCurrentUser ? {color: '#4db013'} : {}

    const name = isCurrentUser && leader.displayName === 'no display name' && lockCollection?.displayName
        ? lockCollection?.displayName
        : leader.displayName

    const leaderName = name && name.length > maxLength
        ? name.slice(0, maxLength) + '...'
        : name

    if (!leader.privacyAnonymous) {
        const safeName = leaderName.replace(/\s/g, '_')
        const id = leader.id || leader.userId
        const href = tab === 'blackBelts'
            ? `/#/profile/${id}/scorecard?name=${safeName}`
            : tab === 'safelocks'
                ? `/#/profile/${id}/safelocks?name=${safeName}`
                : `/#/profile/${id}?name=${safeName}`

        return <LeaderLink style={style} href={href}>
            {leaderName === 'no display name' ? 'Anonymous' : leaderName}
        </LeaderLink>
    } else {
        return 'Anonymous'
    }
}

export default LeaderboardName
