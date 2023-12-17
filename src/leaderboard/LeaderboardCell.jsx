import React from 'react'
import TableCell from '@mui/material/TableCell'

function LeaderboardCell({align = 'center', user, leader, value}) {
    const {displayName, id} = leader
    const isCurrentUser = user?.uid === id
    const color = (!displayName ? '#fff' : '#ccc')
    const style = isCurrentUser
        ? {fontWeight: 500, color: '#4db013'}
        : {fontWeight: 400, color}
    const sx = {color}

    return (
        <TableCell align={align} sx={sx} style={style}>
            {value}
        </TableCell>
    )
}

export default LeaderboardCell
