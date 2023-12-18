import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'
import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../contexts/AuthContext'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import dayjs from 'dayjs'
import LeaderboardHeader from './LeaderboardHeader'
import LeaderboardRow from './LeaderboardRow'
import leaderboardData from '../data/leaderboardData.json'

function Leaderboard() {
    const {user} = useContext(AuthContext)
    const [data, setData] = useState({data: [], metadata: {}})
    useEffect(() => {
        // const load = async () => {
        //     const response = await fetch(dataUrl)
        //     const value = await response.json()
        //     setData(value)
        // }
        try {
            //TODO: Workaround because of CORS issue
            setData(leaderboardData)
            // load()
        } catch(ex) {
            console.error('Error loading leaderboard data.', ex)
            enqueueSnackbar('Error loading leaderboard data. Please reload the page.', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>,
            })
        }
    }, [])
    const updateTime = dayjs(data.metadata.updatedDateTime).format('MM/DD/YY hh:mm')

    return (
        <React.Fragment>
            <div style={{
                padding: '8px', fontSize: '0.8rem', textAlign: 'right', color: '#ccc',
                maxWidth: 700, backgroundColor: '#111', marginLeft: 'auto', marginRight: 'auto'
            }}/>

            <div style={{
                maxWidth: 700, padding: '8px 8px 16px 8px', backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto'
            }}>
                <TableContainer sx={{borderRadius: 0, height:'78vh', overflowY: 'scroll', backgroundColor: '#111'}}>
                    <Table sx={{borderRadius: 0}} stickyHeader>
                        <LeaderboardHeader/>

                        <TableBody>
                            {data.data.map((leader, index) =>
                                <LeaderboardRow key={leader.id} index={index} leader={leader} user={user}/>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div style={{
                padding: '8px 12px 24px 8px', fontSize: '0.8rem', textAlign: 'right', color: '#ccc',
                maxWidth: 700, backgroundColor: '#111', marginLeft: 'auto', marginRight: 'auto'
            }}>
                Last updated: {updateTime} GMT
            </div>
        </React.Fragment>
    )
}

// const dataUrl = 'https://explore.lpubelts.com/leaderboard/leaderboardData.json'
// const dataUrl = 'https://explore.lpubelts.com/leaderboard/leaderboardData.html'
// const dataUrl = 'https://images.lpubelts.com/leaderboardData.json'
// const dataUrl = 'https://explore.lpubelts.com/test/leaderboardData.html'

export default Leaderboard
