import React, {useState} from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'

const DisplayTable = ({
                          tableData,
                          tableWidth,
                          tableHeight,
                          backgroundColor = '#222',
                          fontSize,
                          colorData = '#eee',
                          fontWeightData = 400,
                          paddingData = 5,
                          wrap,
                          showHeader = true,
                          alternateRows = false
                      }) => {
    const bodyStyle = {}

    const whiteSpace = wrap ? 'inherit' : 'nowrap'

    //tableData.columns.filter(x => x?.id && x?.align)

    // don't show 'date' column if 'dateString' column exists
    const [hasDateString, setHasDateString] = useState(false)
    tableData.columns.map(
        column => column?.id === 'dateString' && !hasDateString ? setHasDateString(true) : null
    )
    tableData.columns = hasDateString
        ? tableData.columns.filter((column => column.id !== 'date')).filter(x => x)
        : tableData.columns.filter(x => x)

    const alternateRowStyle = alternateRows
        ? {
            '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#191919'},
            'td, th': {}
        }
        : { border: 0, backgroundColor: 'inherit' }


    return (
        <div style={{backgroundColor: backgroundColor, padding: '0px 8px 8px 8px'}}>
            <div style={{fontSize: '1.2rem', margin: '10px'}}>{tableData.title}</div>
            <TableContainer id='statsTable'
                            style={{
                                padding: '0px 0px 0px 0px',
                                width: tableWidth,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                height: tableHeight
                            }}>
                <Table size='small' stickyHeader={!!tableHeight}>
                    {showHeader &&
                        <TableHead>
                            <TableRow>
                                {tableData.columns.map((column, index) =>
                                    <TableCell key={index + 1}
                                               sx={{
                                                   textAlign: column?.align,
                                                   fontSize: fontSize,
                                                   lineHeight: '1.1rem',
                                                   padding: '8px',
                                                   backgroundColor: backgroundColor,
                                                   color: '#fff'
                                               }}
                                               component='th' scope='row'>
                                        {column.name}
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                    }
                    <TableBody>
                        {tableData.rows.map((row, index) =>
                            <TableRow key={index} index={index}
                                      sx={alternateRowStyle}>
                                {tableData.columns.map((column, index) =>
                                    <TableCell key={index + 1} style={bodyStyle}
                                               sx={{
                                                   textAlign: column.align,
                                                   fontSize: fontSize,
                                                   fontWeight: fontWeightData,
                                                   whiteSpace: whiteSpace,
                                                   padding: `${paddingData}px`,
                                                   border: 0,
                                                   color: colorData
                                               }}
                                               component='th' scope='row'>
                                        {row[column.id] ? row[column.id] : null}
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
export default DisplayTable
