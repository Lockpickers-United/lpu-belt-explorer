import React, {memo, useContext} from 'react'
import LeaderboardContext from "../contexts/LeaderboardContext.jsx";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Leaderboard() {
    const {leaderboardData} = useContext(LeaderboardContext)
    const leaderboardColumns = ['Pos', 'Own', 'Picked', 'Rec', 'Wishlist']

    /*
        "id": "UbhgAjZIuLauV1dw2G4QsocHIk83",
        "DisplayName": "Georgia Jim",
        "DateTime": "2023-12-15T20:28:42",
        "position": 1,
        "own": 233,
        "picked": 255,
        "recorded": 240,
        "wishlist": 0
    */


    const style = {
        maxWidth: 700, marginLeft:
            'auto', marginRight:
            'auto', marginTop:
            0
    }

    return (
        <React.Fragment>
            <div style={{
                maxWidth: 700, padding: '8px 8px 16px 8px', backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto'
            }}>

                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650, borderRadius: 0}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell key='Display Name'>Display Name</TableCell>
                                {leaderboardColumns.map((column) => (
                                    <TableCell align={'center'} key={column}>{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {leaderboardData.map((leader) => (
                                <TableRow
                                    key={leader.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row"> {leader.DisplayName} </TableCell>
                                    <TableCell align={'center'}>{leader.position}</TableCell>
                                    <TableCell align={'center'}>{leader.own}</TableCell>
                                    <TableCell align={'center'}>{leader.picked}</TableCell>
                                    <TableCell align={'center'}>{leader.recorded}</TableCell>
                                    <TableCell align={'center'}>{leader.wishlist}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{margin: 8, marginBottom: 24}}/>
        </React.Fragment>


    )
}

export default React.memo(Leaderboard)
