import React, {useCallback, useContext, useMemo, useRef, useState} from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import queryString from 'query-string'
import {useLocation, useSearchParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import dayjs from 'dayjs'
import LeaderboardHeader from './LeaderboardHeader'
import LeaderboardRow from './LeaderboardRow'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import LeaderboardSearchBox from './LeaderboardSearchBox.jsx'
import LeaderboardSortButton from './LeaderboardSortButton.jsx'
import LeaderboardFindMeButton from './LeaderboardFindMeButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import Nav from '../nav/Nav.jsx'

function Leaderboard({data, loading}) {
    const location = useLocation()
    const {user} = useContext(AuthContext)
    const scrollableRef = useRef()
    const [searchParams, setSearchParams] = useSearchParams()
    const {isMobile} = useWindowSize()

    const [page, setPage] = useState('locks')

    const {highlightedUser, sort, tab} = useMemo(() => {
        const query = queryString.parse(location.search)
        return {
            highlightedUser: query.user,
            sort: (query.sort && validSort.includes(query.sort)) ? query.sort : undefined,
            tab: (query.tab && validTab.includes(query.tab)) ? query.tab : 'locks'
        }
    }, [location.search])

    const tabData = useMemo(() => {
        return {
            locks: {
                defaultSort: 'locksCollection',
                columns: [
                    {field: 'own', order: 'desc', tooltip: 'Sort by Own'},
                    {field: 'picked', order: 'desc', tooltip: 'Sort by Picked'},
                    {field: 'wishlist', order: 'desc', tooltip: 'Sort by Wishlist'},
                    {field: 'recordedLocks', order: 'desc', tooltip: 'Sort by Scorecard'}
                ]
            },
            safelocks: {
                defaultSort: 'safelocksCollection',
                columns: [
                    {field: 'safelocksOwn', order: 'desc', tooltip: 'Sort by Own'},
                    {field: 'safelocksCracked', order: 'desc', tooltip: 'Sort by Cracked'},
                    {field: 'safelocksWishlist', order: 'desc', tooltip: 'Sort by Wishlist'}
                ]
            },
            blackBelts: {
                defaultSort: 'danPoints',
                columns: [
                    {field: 'danLevel', order: 'desc', tooltip: 'Sort by Dan Level'},
                    {field: 'danPoints', order: 'desc', tooltip: 'Sort by Dan Points'},
                    {field: 'blackBeltAwardedAt', order: 'asc', tooltip: 'Sort by Date'}
                ]
            },
        }
    }, [])

    const sortOrder = tabData[tab]['columns'].find(col => col.field === sort) ? tabData[tab]['columns'].find(col => col.field === sort)['order'] : 'desc'

    console.log('sortOrder', sortOrder)

    const filteredData = useMemo(() => {
        return data.data
            .filter(leader => leader[tabData[tab]['defaultSort']] > 0)
            .sort((a, b) => {
                return b[tabData[tab]['defaultSort']] - a[tabData[tab]['defaultSort']]
            })
    }, [data.data, tab, tabData])

    const sortedData = useMemo(() => {
        if (sort && sortOrder === 'desc') return filteredData.sort((a, b) => {
            return b[sort] - a[sort]
        })
        else if (sort && sortOrder === 'asc') return filteredData.sort((a, b) => {
            return a[sort] - b[sort]
        })
        else return filteredData.sort((a, b) => {
            return b[tabData[tab]['defaultSort']] - a[tabData[tab]['defaultSort']]
        })
    }, [sort, sortOrder, filteredData, tabData, tab])

    const updateTime = dayjs(data.metadata['updatedDateTime']).format('MM/DD/YY HH:mm')

    const handleClick = useCallback(value => {
        if (value && value !== tab) {
            searchParams.set('tab', value)
        } else {
            searchParams.delete('tab')
        }
        searchParams.delete('sort')
        setSearchParams(searchParams)
        setPage(value)
    }, [searchParams, setSearchParams, tab])

    console.log('sortedData', sortedData)

    const nav = (
        <React.Fragment>
            <LeaderboardSearchBox data={sortedData}/>
            <LeaderboardSortButton/>
            <LeaderboardFindMeButton/>
            {!isMobile && <div style={{flexGrow: 1}}/>}
        </React.Fragment>
    )
    const title = loading ? 'Loading...' : 'Leaderboard'

    return (
        <React.Fragment>
            <Nav title={title} extras={nav}/>

            {loading && <LinearProgress variant='indeterminate' color='secondary'/>}

            <div style={{
                maxWidth: 700, padding: 8, backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16
            }}>

                <div style={{flexGrow: 1, textAlign: 'center', marginBottom:20}}>
                    <ToggleButtonGroup
                        variant='outlined'
                        size='large'
                    >
                        <ToggleButton onClick={() => handleClick('locks')}
                                      selected={page === 'locks'}
                                      disabled={page === 'locks'}
                                      value='collection'
                                      style={{padding: '2px 12px 2px 12px'}}>
                            Locks
                        </ToggleButton>
                        <ToggleButton onClick={() => handleClick('safelocks')}
                                      selected={page === 'safelocks'}
                                      disabled={page === 'safelocks'}
                                      value='safelocks'
                                      style={{padding: '2px 12px 2px 12px'}}>
                            Safe Locks
                        </ToggleButton>
                        <ToggleButton onClick={() => handleClick('blackBelts')}
                                      selected={page === 'blackBelts'}
                                      disabled={page === 'blackBelts'}
                                      value='scorecard'
                                      style={{padding: '2px 12px 2px 12px'}}>
                            Black Belts
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>


                <TableContainer sx={{height: '78vh', backgroundColor: '#111'}} id='scrollable' ref={scrollableRef}>
                    <Table stickyHeader>
                        <LeaderboardHeader columns={tabData[tab]['columns']}/>

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
                                        columns={tabData[tab]['columns']}
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
    'recordedLocks',
    'wishlist',
    'safelocksOwn',
    'safelocksCracked',
    'safelocksWishlist',
    'danLevel',
    'danPoints',
    'blackBeltAwardedAt',
]

const validTab = [
    'locks',
    'safelocks',
    'blackBelts'
]

export default Leaderboard
