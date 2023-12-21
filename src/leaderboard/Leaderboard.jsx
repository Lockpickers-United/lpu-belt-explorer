import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import {enqueueSnackbar} from 'notistack'
import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../contexts/AuthContext'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import dayjs from 'dayjs'
import LeaderboardHeader from './LeaderboardHeader'
import LeaderboardRow from './LeaderboardRow'
import leaderboardPlaceholder from '../data/leaderboardPlaceholder.json'

function Leaderboard() {
    const {user} = useContext(AuthContext)
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
    const updateTime = dayjs(data.metadata.updatedDateTime).format('MM/DD/YY hh:mm')

    return (
        <React.Fragment>
            {loading && <LinearProgress variant='indeterminate' color='secondary'/>}

            <div style={{
                maxWidth: 700, padding: 8, backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16
            }}>
                <TableContainer sx={{height: '78vh', backgroundColor: '#111'}}>
                    <Table stickyHeader>
                        <LeaderboardHeader/>

                        <TableBody>
                            {loading && leaderboardPlaceholder.data.map((leader, index) => <LeaderboardRow
                                key={leader.id} index={index} leader={leader} user={user}/>
                            )}
                            {data.data.map((leader, index) =>
                                <LeaderboardRow key={leader.id} index={index} leader={leader} user={user}/>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant='caption' align='right' component='div' style={{width: '100%', marginTop: 8}}>
                    Last updated: {updateTime} GMT
                </Typography>
            </div>
        </React.Fragment>

    )
}

const dataUrl = 'https://explore.lpubelts.com/leaderboard/leaderboardData.json'

export default Leaderboard
