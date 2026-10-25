import React from 'react'
import {uniqueBelts} from '../data/belts'
import useWindowSize from '../util/useWindowSize.jsx'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import BeltIcon from '../entries/BeltIcon.jsx'

export default function PlatformBeltCountsTable({data}) {

    /**
     * @prop beltedUsers
     * @prop belts
     * @prop dans
     */

    const {discordBeltCounts, redditBeltCounts} = data

    const discordTotal = Object.keys(discordBeltCounts)
        .filter(belt => belt.includes('Belt'))
        .reduce((acc, belt) => {
            return acc + discordBeltCounts[belt]
        }, 0)

    const redditTotal = Object.keys(redditBeltCounts)
        .filter(belt => belt.includes('Belt'))
        .reduce((acc, belt) => {
            return acc + redditBeltCounts[belt]
        }, 0)

    const tableRows = uniqueBelts.reduce((acc, belt) => {
        const fullBeltName = `${belt} Belt`
        acc.push({
            belt,
            discord: discordBeltCounts[fullBeltName],
            reddit: redditBeltCounts[fullBeltName]
        })
        return acc
    }, [])

    tableRows.push({belt: 'Total', discord: discordTotal, reddit: redditTotal})

    const tableData = {
        columns: [
            {'name': 'Discord', 'align': 'center', 'id': 'discord'},
            {'name': 'Belt', 'align': 'center', 'id': 'belt'},
            {'name': 'Reddit', 'align': 'center', 'id': 'reddit'}
        ],
        data: tableRows
    }


    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560
    const midWindow = width <= 820

    const fontSize = mobileSmall ? '.8rem'
        : mobileMedium ? '.85rem'
            : mobileLarge ? '.9rem'
                : smallWindow ? '.95rem'
                    : midWindow ? '.95rem'
                        : '.95rem'

    const tableWidth = 250
    const bodyStyle = {}
    const whiteSpace = 'nowrap'

    return (

        <div style={{marginLeft: 40, marginRight: 40}}>
            <div style={{fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', marginBottom: 5}}>
                Belt Counts
            </div>
            {tableData.title &&
                <div style={{fontSize: '1.3rem', margin: '10px'}}>{tableData.title}</div>
            }
            <TableContainer id='statsTable'
                            style={{
                                padding: '0px 0px 0px 0px',
                                width: tableWidth,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                border: '1px solid #444'
                            }}
                            component={Paper} elevation={2}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            {tableData.columns.map((column, index) =>
                                <TableCell key={index + 1}
                                           sx={{
                                               textAlign: column?.align,
                                               fontSize: fontSize,
                                               lineHeight: '1.1rem',
                                               padding: '8px',
                                               backgroundColor: '#111',
                                               color: '#fff'
                                           }}
                                           component='th' scope='row'>
                                    {column.name}
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.data.map((row, index) =>
                            <TableRow key={index} index={index}
                                      sx={{
                                          '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#191919'},
                                          'td, th': {}
                                      }}>
                                {tableData.columns.map((column, index) =>
                                    <TableCell key={index + 1} style={bodyStyle}
                                               sx={{
                                                   textAlign: column.align,
                                                   fontSize: fontSize,
                                                   whiteSpace: whiteSpace,
                                                   padding: '8px',
                                                   border: 0,
                                                   color: '#eee',
                                                   justifyItems: 'center',
                                                   fontWeight: 700
                                               }}
                                               component='th' scope='row'>
                                        {column.id === 'belt' && row[column.id] !== 'Total'
                                            ? <BeltIcon value={row[column.id]} style={{marginBottom: -10}}
                                                        containerStyle={{
                                                            width: 32,
                                                            maxWidth: 32,
                                                            marginRight: 'auto',
                                                            marginLeft: 'auto'
                                                        }}/>
                                            : row[column.id] ? row[column.id].toLocaleString() : ''
                                        }
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    )

}