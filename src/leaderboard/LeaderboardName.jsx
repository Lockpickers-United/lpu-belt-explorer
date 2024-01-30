import React from 'react'

function LeaderboardName({leader, isCurrentUser}) {
    const style = {
        textDecoration: 'none',
        color: isCurrentUser ? '#4db013' : '#fff'
    }
    if (leader.displayName) {
        const safeName = leader.displayName.replace(/\s/g, '_')
        const href = `/#/profile/${leader.id}?name=${safeName}`
        return <a style={style} href={href}>{leader.displayName}</a>
    } else {
        return 'Anonymous'
    }
}

export default LeaderboardName
