import React, {memo, useContext} from 'react'
import BeltStripe from '../entries/BeltStripe.jsx'
import CollectionButton from '../entries/CollectionButton.jsx'
import EntryName from '../entries/EntryName.js'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import OpenLinkToEntryButton from '../entries/OpenLinkToEntryButton.jsx'
import queryString from 'query-string'
import {styled} from "@mui/material/styles";
import FilterContext from "../contexts/FilterContext.jsx";
import LeaderboardContext from "../contexts/LeaderboardContext.jsx";
import DataContext from "../contexts/DataContext.jsx";
import EntryList from "../entries/EntryList.jsx";
import { DataGrid } from '@mui/x-data-grid';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Leaderboard() {
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

    const leaderboardColumns = [ 'Pos', 'Own', 'Picked', 'Rec', 'Wishlist']

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
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

    )
}

export default React.memo(Leaderboard)
