import React from 'react'
import TableCell from '@mui/material/TableCell'

function LeaderboardCell({align = 'center', isCurrentUser, value}) {
    const style = isCurrentUser
        ? {fontWeight: 600, color: '#4db013'}
        : {fontWeight: 500, color: '#fff'}

    const displayValue = value !== 0 ? value : ''

    return (
        <TableCell align={align} style={style}>
            {displayValue}
        </TableCell>
    )
}

export default LeaderboardCell
