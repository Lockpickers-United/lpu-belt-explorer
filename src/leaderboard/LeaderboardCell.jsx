import React from 'react'
import TableCell from '@mui/material/TableCell'

function LeaderboardCell({align = 'center', isCurrentUser, leader, value}) {
    const color = (leader.displayName !== 'anonymous' ? '#fff' : '#777')
    const style = isCurrentUser
        ? {fontWeight: 600, color: '#4db013'}
        : {fontWeight: 500, color}
    const sx = {color}

    return (
        <TableCell align={align} sx={sx} style={style}>
            {value}
        </TableCell>
    )
}

export default LeaderboardCell
