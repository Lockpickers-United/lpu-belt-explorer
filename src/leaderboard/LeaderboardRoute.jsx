import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'
import React, {useEffect, useState} from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import Leaderboard from './Leaderboard'
import LeaderboardFindMeButton from './LeaderboardFindMeButton'
import LeaderboardSearchBox from './LeaderboardSearchBox'

function LeaderboardRoute() {
    const [data, setData] = useState({data: [], metadata: {}})
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const load = async () => {
            const response = await fetch(dataUrl)
            const value = await response.json()
            setData(value)
            setLoading(false)
        }
        try {
            load()
        } catch (ex) {
            console.error('Error loading leaderboard data.', ex)
            enqueueSnackbar('Error loading leaderboard data. Please reload the page.', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
            })
            setLoading(false)
        }
    }, [])

    const nav = (
        <React.Fragment>
            <LeaderboardSearchBox data={data}/>
            <LeaderboardFindMeButton/>
            <div style={{flexGrow: 1}}/>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Collection Leaderboard' extras={nav}/>

            <Leaderboard data={data} loading={loading}/>

            <Footer/>

            <Tracker feature='leaderboard'/>
        </React.Fragment>
    )
}

const dataUrl = 'https://explore.lpubelts.com/leaderboard/leaderboardData.json'

export default LeaderboardRoute
