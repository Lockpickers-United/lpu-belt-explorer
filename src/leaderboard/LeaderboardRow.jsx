import TableRow from '@mui/material/TableRow'
import React from 'react'
import LeaderboardCell from './LeaderboardCell'

function LeaderboardRow({index, leader, user}) {
    return (
        <TableRow
            key={leader.id}
            sx={{
                '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#000'},
                'td, th': {padding: '6px 2px', border: 0}
            }}
        >
            <LeaderboardCell leader={leader} user={user} value={index + 1}/>
            <LeaderboardCell leader={leader} user={user} value={leader.displayName || 'Anonymous'} align='left'/>
            <LeaderboardCell leader={leader} user={user} value={leader.own}/>
            <LeaderboardCell leader={leader} user={user} value={leader.picked}/>
            <LeaderboardCell leader={leader} user={user} value={leader.recorded}/>
            <LeaderboardCell leader={leader} user={user} value={leader.wishlist}/>
        </TableRow>
    )
}

export default LeaderboardRow
