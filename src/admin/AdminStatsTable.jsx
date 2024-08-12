import React, {useState} from 'react'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'

const AdminStatsTable = ({tableData, tableWidth, tableHeight, fontSize, wrap}) => {
    const bodyStyle = {}

    const whiteSpace = wrap ? 'inherit' : 'nowrap'

    // don't show 'date' column if 'dateString' column exists
    const [hasDateString, setHasDateString] = useState(false)
    tableData.columns.map(
        column => column.id === 'dateString' && !hasDateString ? setHasDateString(true) : null
    )
    tableData.columns = hasDateString
        ? tableData.columns.filter((column => column.id !== 'date'))
        : tableData.columns

    return (
        <div>
            <div style={{fontSize:'1.3rem', margin:'10px'}}>{tableData.title}</div>
                <TableContainer id='statsTable'
                            style={{
                                padding: '0px 0px 0px 4px',
                                width: tableWidth,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                height: tableHeight
                            }}
                            component={Paper} elevation={2}>
                <Table size='small' stickyHeader={!!tableHeight}>
                    <TableHead>
                        <TableRow>
                            {tableData.columns.map((column, index) =>
                                <TableCell key={index + 1}
                                           sx={{
                                               textAlign: column.align,
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
                                                   color: '#eee'
                                               }}
                                               component='th' scope='row'>
                                        {row[column.id]?.toLocaleString()}
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
export default AdminStatsTable
