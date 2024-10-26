import React, {useContext, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import ScorecardNoTrackRow from './ScorecardNoTrackRow.jsx'
import ScorecardDataContext from '../ScorecardDataProvider.jsx'
import NoScorecardData from '../NoScorecardData.jsx'
import {Paper, TableCell, TableHead, TableRow} from '@mui/material'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableBody from '@mui/material/TableBody'
import Link from '@mui/material/Link'
import {enqueueSnackbar} from 'notistack'

function ScorecardNoTrack({profile}) {
    const {userId} = useParams()

    const {visibleEntries = []} = useContext(ScorecardDataContext)
    const filteredEntries = visibleEntries.filter(e => e.points > 0 || e.awardType)

    const tableColumns = [
        {id: 'lock', name: 'lock', align: 'left'},
        {id: 'version', name: 'version', align: 'left'},
        {id: 'belt', name: 'belt', align: 'left'},
        {id: 'date', name: 'date', align: 'left'},
        {id: 'link', name: 'link', align: 'left'},
        {id: 'modifier', name: 'modifier', align: 'left'},
        {id: 'points', name: 'points', align: 'left'}
    ]

    const {
        cardDanPoints,
        cardBBCount,
        cardEligibleDan,
    } = useContext(ScorecardDataContext)

    const suffixes = {1: 'st', 2: 'nd', 3: 'rd'}
    const requestLevel = suffixes[[cardEligibleDan]]
        ? cardEligibleDan + suffixes[[cardEligibleDan]]
        : cardEligibleDan + 'th'

    const safeName = profile.displayName?.replace(/\s/g, '_')

    const copyRequest = useCallback(async () => {
        const link = `@LPUBeltBot request ${requestLevel} Dan https://lpubelts.com/#/profile/${userId}/scorecard/no-tracking?name=${safeName}`
        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Request copied to clipboard. Take it over to #belt-requests!')
    }, [requestLevel, safeName, userId])


    return (
        <div style={{
            maxWidth: 900, padding: 0, backgroundColor: '#eee',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <div style={{display: 'flex', padding: 8}}>
                <div style={{fontSize: '1.5rem', lineHeight: '1rem', flexGrow: 1, marginRight: 0}}>{profile.displayName}</div>
                <div style={{marginRight: 25}}>Dan Points <strong>{cardDanPoints}</strong></div>
                <div style={{marginRight: 25}}>Black Belt Locks <strong>{cardBBCount}</strong></div>
                <div>Eligible for Dan <span style={{fontSize: '1.7rem', lineHeight: '1rem'}}>{cardEligibleDan}</span>
                </div>
            </div>
            <div style={{width:'100%', textAlign:'right', padding: 8, marginBottom:10}}>
                <Link onClick={copyRequest} style={{color: '#99c2e5', cursor: 'pointer'}}>Copy Request</Link>
            </div>


            {visibleEntries.length === 0 &&
                <NoScorecardData/>
            }

            <div>
                <TableContainer id='statsTable'
                                style={{
                                    padding: '0px 0px 0px 4px',
                                    width: '100%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                                component={Paper} elevation={2}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                {tableColumns.map((column, index) =>
                                    <TableCell key={index + 1}
                                               sx={{
                                                   textAlign: column.align,
                                                   fontSize: '1rem',
                                                   lineHeight: '1.1rem',
                                                   padding: '8px',
                                                   backgroundColor: '#bbb',
                                                   color: '#000'
                                               }}
                                               component='th' scope='row'>
                                        {column.name}
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEntries.map(act =>
                                <ScorecardNoTrackRow key={act.id}
                                                     activity={act}
                                />
                            )}

                        </TableBody>
                    </Table>
                </TableContainer>

                <br/>
            </div>
        </div>
    )
}

export default ScorecardNoTrack
