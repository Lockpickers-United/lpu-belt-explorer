import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'

function LeaderboardHeader() {
    const style = {border: 0, padding: '4px 12px', backgroundColor: '#000'}
    return (
        <TableHead>
            <TableRow>
                <TableCell align='center' style={style}>
                    #
                </TableCell>
                <TableCell
                    key='Display Name'
                    style={{
                        fontWeight: 700, fontSize: '1.2rem', border: 0,
                        padding: '4px 16px 4px 0px',
                        backgroundColor: '#000'
                    }}
                >
                    Name
                </TableCell>
                <TableCell align='center' style={style}>
                    <LockIcon/>
                </TableCell>
                <TableCell align='center' style={style}>
                    <LockOpenOutlinedIcon/>
                </TableCell>
                <TableCell align='center' style={style}>
                    <VideocamOutlinedIcon/>
                </TableCell>
                <TableCell align='center' style={style}>
                    <SavingsOutlinedIcon/>
                </TableCell>
            </TableRow>
        </TableHead>
    )
}

export default LeaderboardHeader
