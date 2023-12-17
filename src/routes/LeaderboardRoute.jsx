import React from 'react'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import Leaderboard from "../leaderboard/Leaderboard.jsx";
import {LeaderboardProvider} from "../contexts/LeaderboardContext.jsx";

function LeaderboardRoute() {
    return (
        <React.Fragment>
            <Nav/>

            <LeaderboardProvider>
                <Leaderboard/>
            </LeaderboardProvider>

            <Footer/>
        </React.Fragment>
    )
}

export default LeaderboardRoute
