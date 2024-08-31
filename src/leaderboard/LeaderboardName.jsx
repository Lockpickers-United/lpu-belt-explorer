import React from 'react'
import makeStyles from '@mui/styles/makeStyles'

function LeaderboardName({leader, isCurrentUser, tab}) {

    const classes = useStyles()
    const style = isCurrentUser ? {color: '#4db013'} : {}

    if (leader.displayName && !leader.privacyAnonymous) {
        const safeName = leader.displayName.replace(/\s/g, '_')

        const href = tab === 'blackBelts'
            ? `/#/profile/${leader.id}/scorecard?name=${safeName}`
            : tab === 'safelocks'
                ? `/#/profile/${leader.id}/safelocks?name=${safeName}`
                : `/#/profile/${leader.id}?name=${safeName}`

        return <a className={classes.name} style={style} href={href}>{leader.displayName}</a>
    } else {
        return 'Anonymous'
    }
}

const useStyles = makeStyles({
    name: {
        textDecoration: 'none',
        color: '#fff',
        '&:hover': {
            color: '#777'
        }
    }
})

export default LeaderboardName
