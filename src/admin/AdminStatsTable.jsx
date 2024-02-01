import React from 'react'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'

const AdminStatsTable = ({tableData, tableWidth, fontSize}) => {
    const bodyStyle = {}

    return (
        <div style={{}}>
            {tableData.title}
            <TableContainer id='dailyAverages'
                            style={{
                                padding: '0px 0px 0px 4px',
                                width: tableWidth,
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                            component={Paper} elevation={2}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            {tableData.columns.map((column, index) =>
                                <TableCell key={index + 1}
                                           sx={{
                                               textAlign: column.align,
                                               fontSize: fontSize,
                                               lineHeight: '1.1rem',
                                               padding: '8px',
                                               color:'#fff'
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
                                          '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#111'},
                                          'td, th': {padding: '7px 1px', margin: '0px'}
                                      }}>
                                {tableData.columns.map((column, index) =>

                                    <TableCell key={index + 1} style={bodyStyle}
                                               sx={{
                                                   textAlign: column.align,
                                                   fontSize: fontSize,
                                                   whiteSpace: 'nowrap',
                                                   border: 0,
                                                   color:'#eee'
                                               }}
                                               component='th' scope='row'>
                                        {row[column.id].toLocaleString()}
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
