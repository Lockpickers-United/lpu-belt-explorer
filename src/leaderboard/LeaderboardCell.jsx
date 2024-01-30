import React, {useContext} from 'react'
import TableCell from '@mui/material/TableCell'
import AuthContext from '../app/AuthContext'

function LeaderboardCell({align = 'center', leader, value}) {
    const {user} = useContext(AuthContext)
    const {displayName, id} = leader
    const isCurrentUser = user?.uid === id
    const color = (displayName ? '#eee' : '#bbb')
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
