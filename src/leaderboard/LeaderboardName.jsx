import React from 'react'

function LeaderboardName({leader, isCurrentUser}) {
    const style = {
        textDecoration: 'none',
        color: isCurrentUser ? '#4db013' : '#fff'
    }
    if (leader.displayName) {
        const href = `/#/profile/${leader.id}?name=${leader.displayName}`
        return <a style={style} href={href}>{leader.displayName}</a>
    } else {
        return 'Anonymous'
    }
}

export default LeaderboardName
