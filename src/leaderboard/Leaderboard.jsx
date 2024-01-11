import React, {useContext, useMemo, useRef} from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import queryString from 'query-string'
import {useLocation} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import dayjs from 'dayjs'
import LeaderboardHeader from './LeaderboardHeader'
import LeaderboardRow from './LeaderboardRow'

function Leaderboard({data, loading}) {
    const location = useLocation()
    const {user} = useContext(AuthContext)
    const scrollableRef = useRef()

    const {user: highlightedUser} = useMemo(() => {
        return queryString.parse(location.search)
    }, [location.search])

    const updateTime = loading ? '####-##-## ##:##' : dayjs(data.metadata.updatedDateTime).format('MM/DD/YY hh:mm')
    const rows = loading ? skeletonData : data.data

    return (
        <React.Fragment>
            {loading && <LinearProgress variant='indeterminate' color='secondary'/>}

            <div style={{
                maxWidth: 700, padding: 8, backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16
            }}>
                <TableContainer sx={{height: '78vh', backgroundColor: '#111'}} id='scrollable' ref={scrollableRef}>
                    <Table>
                        <LeaderboardHeader/>

                        <TableBody>
                            {rows.map((leader, index) => {
                                const isHighlighted = !!highlightedUser && (
                                    (highlightedUser === 'me' && leader.id === user.uid)
                                    || (highlightedUser === leader.displayName)
                                )
                                return (
                                    <LeaderboardRow
                                        key={leader.id}
                                        index={index}
                                        leader={leader}
                                        user={user}
                                        scrollableRef={scrollableRef}
                                        highlighted={isHighlighted}
                                    />
                                )
                            })}
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

const skeletonData = [...Array(40)]
    .map((_, id) => ({
        id,
        displayName: '........................',
        own: '---',
        picked: '---',
        recorded: '---',
        wishlist: '--'
    }))

export default Leaderboard
