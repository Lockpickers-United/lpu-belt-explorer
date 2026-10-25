import React, {useCallback, useContext, useMemo, useState} from 'react'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'
import dayjs from 'dayjs'
import ReportsContext from '../ReportsContext.jsx'

const BlackBeltsTable = () => {
    const navigate = useNavigate()
    const [sort, setSort] = useState('')
    const {data} = useContext(ReportsContext)

    const blackBelts = useMemo(() => Object.keys(data?.collectionStatsDaily?.blackBelts || {}).map(userId => {
        const displayName = data?.collectionStatsDaily?.blackBelts[userId].displayName
        const scorecardLink = `/profile/${userId}/scorecard`
        const tabClaimed = data?.collectionStatsDaily?.blackBelts[userId].tabClaimed
        const firstSeen = data?.collectionStatsDaily?.blackBelts[userId].acquired
        return {userId, displayName, scorecardLink, tabClaimed, firstSeen}
    }),[data?.collectionStatsDaily?.blackBelts])

    const sortedBlackBelts = (sort === 'name')
        ? blackBelts.sort((a, b) => {
            return a.displayName.localeCompare(b.displayName)
        })
        : blackBelts.sort((a, b) => {
            return dayjs(a.firstSeen).valueOf() - dayjs(b.firstSeen).valueOf()
                || a.displayName.localeCompare(b.displayName)
        })

    const bodyStyle = {}

    const openScorecard = useCallback(link => {
        navigate(link)
    }, [navigate])

    return (
        <div>
            <TableContainer id='statsTable'
                            style={{
                                padding: '0px 0px 0px 4px',
                                width: 700,
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                            component={Paper} elevation={2}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    lineHeight: '1.1rem',
                                    padding: '8px',
                                    backgroundColor: '#111',
                                    color: '#fff'
                                }}
                                component='th' scope='row'>
                                #
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    lineHeight: '1.1rem',
                                    padding: '8px',
                                    backgroundColor: '#111',
                                    color: '#fff'
                                }}
                                component='th' scope='row'>
                                <Link onClick={() => setSort('name')} style={{color:'#d9d9ff'}}>Display Name</Link>
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    lineHeight: '1.1rem',
                                    padding: '8px',
                                    backgroundColor: '#111',
                                    color: '#fff'
                                }}
                                component='th' scope='row'>
                                Claimed Tab
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    lineHeight: '1.1rem',
                                    padding: '8px',
                                    backgroundColor: '#111',
                                    color: '#fff'
                                }}
                                component='th' scope='row'>
                                <Link onClick={() => setSort('date')} style={{color:'#d9d9ff'}}>Acquired</Link>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedBlackBelts.map((row, index) =>
                            <TableRow key={index} index={index}
                                      sx={{
                                          '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#191919'},
                                          'td, th': {}
                                      }}>
                                <TableCell style={bodyStyle}
                                           sx={{
                                               textAlign: 'left',
                                               fontSize: '0.9rem',
                                               padding: '8px',
                                               border: 0,
                                           }}
                                           component='th' scope='row'>
                                    {index + 1}
                                </TableCell>
                                <TableCell style={bodyStyle}
                                           sx={{
                                               textAlign: 'left',
                                               fontSize: '0.9rem',
                                               padding: '8px',
                                               border: 0,
                                               color: '#eee'
                                           }}
                                           component='th' scope='row'>
                                    <Link onClick={() => {
                                        openScorecard(row.scorecardLink)
                                    }} style={{color: '#99c2e5', cursor: 'pointer'}}>{row.displayName}</Link>
                                </TableCell>
                                <TableCell style={bodyStyle}
                                           sx={{
                                               textAlign: 'left',
                                               fontSize: '0.9rem',
                                               padding: '8px',
                                               border: 0,
                                           }}
                                           component='th' scope='row'>
                                    {row.tabClaimed}
                                </TableCell>
                                <TableCell style={bodyStyle}
                                           sx={{
                                               textAlign: 'left',
                                               fontSize: '0.9rem',
                                               padding: '8px',
                                               border: 0
                                           }}
                                           component='th' scope='row'>
                                    {row.firstSeen}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default BlackBeltsTable
