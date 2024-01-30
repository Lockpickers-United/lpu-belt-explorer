import React from 'react'

function LeaderboardName({leader}) {
    const style = {
        textDecoration: 'none',
        color: 'white'
    }
    if (leader.displayName) {
        return <a style={style} href={`/#/profile/${leader.id}`}>{leader.displayName}</a>
    } else {
        return 'Anonymous'
    }
}

export default LeaderboardName
