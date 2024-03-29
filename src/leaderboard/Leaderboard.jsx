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

    const filteredData = useMemo(() => {
        return data.data.filter(datum => datum.displayName !== 'anonymous')
    }, [data.data])

    const {highlightedUser, sort} = useMemo(() => {
        const query = queryString.parse(location.search)
        return {
            highlightedUser: query.user,
            sort: (query.sort && validSort.includes(query.sort)) ? query.sort : undefined
        }
    }, [location.search])

    const sortedData = useMemo(() => {
        if (sort) return filteredData.toSorted((a, b) => b[sort] - a[sort])
        else return filteredData
    }, [sort, filteredData])

    const updateTime = dayjs(data.metadata.updatedDateTime).format('MM/DD/YY HH:mm')

    return (
        <React.Fragment>
            {loading && <LinearProgress variant='indeterminate' color='secondary'/>}

            <div style={{
                maxWidth: 700, padding: 8, backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16
            }}>
                <TableContainer sx={{height: '78vh', backgroundColor: '#111'}} id='scrollable' ref={scrollableRef}>
                    <Table stickyHeader>
                        <LeaderboardHeader/>

                        <TableBody>
                            {sortedData.map((leader, index) => {
                                const isHighlighted = !!highlightedUser && (
                                    (highlightedUser === 'me' && leader.id === user?.uid)
                                    || (highlightedUser === leader.displayName)
                                )
                                return (
                                    <LeaderboardRow
                                        key={leader.id}
                                        index={index}
                                        leader={leader}
                                        scrollableRef={scrollableRef}
                                        highlighted={isHighlighted}
                                    />
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant='caption' align='right' component='div' style={{width: '100%', marginTop: 8}}>
                    Updated hourly, last update: {updateTime} GMT
                </Typography>
            </div>
        </React.Fragment>
    )
}

const validSort = [
    'own',
    'picked',
    'recorded',
    'wishlist'
]

export default Leaderboard
