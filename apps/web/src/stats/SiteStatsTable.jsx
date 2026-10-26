import React from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'

const SiteStatsTable = ({tableData}) => {
    const headerStyle = {padding: '0px', fontWeight: 700, backgroundColor: '#000'}
    const bodyStyle = {border: 0, padding: '4px 8px 0px 0px', fontWeight: 400}

    return (
        <TableContainer id='dailyAverages' style={{padding: '0px 0px 0px 4px', maxWidth: '400px'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2} style={headerStyle}>{tableData.description}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.data.map((metric, index) =>
                        <TableRow key={index} index={index}>
                            <TableCell key={index + 1} style={bodyStyle}>{metric.label}</TableCell>
                            <TableCell style={bodyStyle}
                                       sx={{textAlign: 'left'}}>{metric.value.toLocaleString()}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
export default SiteStatsTable
