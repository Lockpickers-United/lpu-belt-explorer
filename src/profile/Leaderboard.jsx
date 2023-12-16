import React, {memo, useContext} from 'react'
import LeaderboardContext from "../contexts/LeaderboardContext.jsx";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'

function Leaderboard(index) {
    const {leaderboardData} = useContext(LeaderboardContext)

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

    const leaderboardColumns = ['Rank', 'Own', 'Picked', 'Rec', 'Wishlist']

    return (
        <React.Fragment>
            <div style={{
                maxWidth: 700, padding: '8px 8px 16px 8px', backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto'
            }}>
                <TableContainer sx={{borderRadius: 0, height: '600px', overflowY: 'scroll', backgroundColor: '#111'}}>
                    <Table sx={{borderRadius: 0}}
                           aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#000',}}>
                                <TableCell key='Display Name'
                                           style={{fontWeight: 700, fontSize:'1.2rem', border: 0, padding: '4px 16px'}}>Name</TableCell>
                                <TableCell align={'center'} style={{
                                    border: 0, padding: '4px 12px' }}><LockIcon/></TableCell>
                                <TableCell align={'center'} style={{
                                    border: 0, padding: '4px 12px' }}><LockOpenOutlinedIcon sx={{}}/></TableCell>
                                <TableCell align={'center'} style={{
                                    border: 0, padding: '4px 12px' }}><VideocamOutlinedIcon/></TableCell>
                                <TableCell align={'center'} style={{
                                    border: 0, padding: '4px 12px' }}><SavingsOutlinedIcon/></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {leaderboardData.map((leader) => (
                                <TableRow
                                    key={leader.id}
                                    sx={{
                                        '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#000'},
                                        'td, th': {padding: '6px 12px', border: 0}
                                    }}
                                >
                                    <TableCell component="th" scope="row"
                                               sx={{fontWeight: (leader.DisplayName !== 'Anonymous' ? 500 : null)}}
                                    >
                                        {leader.position}&nbsp;{leader.DisplayName}
                                    </TableCell>

                                    <TableCell align={'center'} sx={{}}>{leader.own}</TableCell>
                                    <TableCell align={'center'} sx={{}}>{leader.picked}</TableCell>
                                    <TableCell align={'center'} sx={{}}>{leader.recorded}</TableCell>
                                    <TableCell align={'center'} sx={{}}>{leader.wishlist}</TableCell>
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
