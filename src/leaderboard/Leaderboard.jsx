import React, {useCallback, useContext, useMemo, useRef, useState} from 'react'
import queryString from 'query-string'
import {useLocation, useNavigate} from 'react-router-dom'
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
import LeaderboardCompare from './LeaderboardCompare.jsx'
import {leaderboardData, recentAwardsEvidence} from '../data/dataUrls'
import useData from '../util/useData.jsx'
import LoadingDisplay from '../util/LoadingDisplay.jsx'
import LeaderboardRecent from './LeaderboardRecent.jsx'
import AppContext from '../app/AppContext.jsx'

function Leaderboard({tab}) {

    const {data, loading, error} = useData({urls})
    const {admin} = useContext(AppContext)

    const location = useLocation()
    const {user} = useContext(AuthContext)
    const scrollableRef = useRef()
    const {isMobile} = useWindowSize()
    const navigate = useNavigate()

    const {bb1, bb2, compareMode} = useMemo(() => {
        const query = queryString.parse(location.search)
        return {
            bb1: query.bb1 ? query.bb1 : undefined,
            bb2: query.bb2 ? query.bb2 : undefined,
            compareMode: !!query.compare
        }
    }, [location.search])

    const [compare, setCompare] = useState(!!bb1 || !!bb2 || compareMode)

    const {highlightedUser, sort} = useMemo(() => {
        const query = queryString.parse(location.search)
        return {
            highlightedUser: query.user,
            sort: (query.sort && validSort.includes(query.sort)) ? query.sort : undefined
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
                    {field: 'blackBeltCount', order: 'desc', tooltip: 'Sort by Black Belt Locks'},
                    {field: 'blackBeltAwardedAt', order: 'asc', tooltip: 'Sort by Date'}
                ]
            },
            recent: {
                defaultSort: '',
                columns: []
            }
        }
    }, [])

    const sortOrder = tabData[tab]['columns'].find(col => col.field === sort) ? tabData[tab]['columns'].find(col => col.field === sort)['order'] : 'desc'

    const filteredData = useMemo(() => {
        const allData = data ?
            data?.leaderboardData.data
                .filter(leader => !leader['privacyNoLeaderboard'])
                .filter(leader => leader[tabData[tab]['defaultSort']] > 0)
            : []
        return tab === 'blackBelts'
            ? allData.filter(leader => leader['blackBeltAwardedAt'] > 0)
            : allData
    }, [data, tab, tabData])

    const blackBeltData = useMemo(() => {
        return data?.leaderboardData.data
            .filter(leader => !leader['privacyNoLeaderboard'])
            .filter(leader => leader['blackBeltAwardedAt'] > 0)
    }, [data])

    const sortedData = useMemo(() => {
        if (sort && sortOrder === 'desc') return filteredData.sort((a, b) => {
            return (b[sort] || 0) - (a[sort] || 0)
        })
        else if (sort && sortOrder === 'asc') return filteredData.sort((a, b) => {
            return (a[sort] || 0) - (b[sort] || 0)
        })
        else return filteredData.sort((a, b) => {
                return (b[tabData[tab]['defaultSort']] || 0) - (a[tabData[tab]['defaultSort']] || 0)
            })
    }, [sort, sortOrder, filteredData, tabData, tab])

    const updateTime = dayjs(data?.leaderboardData.metadata['updatedDateTime']).format('MM/DD/YY HH:mm')

    const handleClick = useCallback(value => {
        setCompare(false)
        if (value && value !== tab) {
            navigate('/leaderboard/' + value)
        }
    }, [navigate, tab])

    const nav = !compare
        ? (
            <React.Fragment>
                <LeaderboardSearchBox data={sortedData}/>
                <LeaderboardSortButton/>
                <LeaderboardFindMeButton tab={tab}/>
                {!isMobile && <div style={{flexGrow: 1}}/>}
            </React.Fragment>
        )
        : null

    const title = loading ? 'Loading...' : 'Leaderboard'
    const safelocksText = isMobile ? 'Safes' : 'Safe Locks'

    const tableHeight = tab === 'blackBelts' ? '100%' : '78vh'

    if (loading) {
        return <LoadingDisplay/>
    }

    if (data && !error) return (
        <React.Fragment>
            <Nav title={title} extras={nav}/>

            <div style={{
                maxWidth: 700, padding: 8, backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16
            }}>

                <div style={{flexGrow: 1, textAlign: 'center', marginBottom: 10}}>
                    <ToggleButtonGroup
                        variant='outlined'
                        size='large'
                    >
                        <ToggleButton onClick={() => handleClick('locks')}
                                      selected={tab === 'locks'}
                                      disabled={tab === 'locks'}
                                      value='collection'
                                      style={{padding: '2px 12px 2px 12px'}}>
                            Locks
                        </ToggleButton>
                        <ToggleButton onClick={() => handleClick('safelocks')}
                                      selected={tab === 'safelocks'}
                                      disabled={tab === 'safelocks'}
                                      value='safelocks'
                                      style={{padding: '2px 12px 2px 12px'}}>
                            {safelocksText}
                        </ToggleButton>
                        <ToggleButton onClick={() => handleClick('blackBelts')}
                                      selected={tab === 'blackBelts'}
                                      disabled={tab === 'blackBelts'}
                                      value='scorecard'
                                      style={{padding: '2px 12px 2px 12px'}}>
                            Black Belts
                        </ToggleButton>
                        {admin &&
                            <ToggleButton onClick={() => handleClick('recent')}
                                          selected={tab === 'recent'}
                                          disabled={tab === 'recent'}
                                          value='recent'
                                          style={{padding: '2px 12px 2px 12px'}}>
                                Recent
                            </ToggleButton>
                        }
                    </ToggleButtonGroup>
                </div>

                {tab === 'blackBelts' &&
                    <LeaderboardCompare blackBeltData={blackBeltData} compare={compare} setCompare={setCompare}/>
                }

                {!compare && tab !== 'recent' &&
                    <React.Fragment>
                        <TableContainer sx={{height: tableHeight, backgroundColor: '#111'}} id='scrollable'
                                        ref={scrollableRef}>
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
                                                tab={tab}
                                            />
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{width: '100%', marginTop: 12, fontSize: '0.8rem', textAlign: 'center'}}>
                            Last update: {updateTime} GMT
                        </div>
                    </React.Fragment>}

                {tab === 'recent' &&
                    <LeaderboardRecent data={data.recentAwardsEvidence}/>
                }


            </div>
        </React.Fragment>
    )
}

const urls = {leaderboardData, recentAwardsEvidence}

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
    'blackBeltCount',
    'blackBeltAwardedAt'
]

export default Leaderboard
