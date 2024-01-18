import React from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'

const CollectionTopLocksList = ({dataset, title}) => {
    const bodyStyle = {border: 0, padding: '4px 8px 0px 0px', fontWeight: 400, textOverflow: 'ellipsis'}

    return (

        <div style={{
            backgroundColor: '#000', border: '1px solid #666', padding: 12,
            align: 'center', margin: '0px 15px 16px 15px', width: 300,
            height: 490, marginLeft: 'auto', marginRight: 'auto'
        }}>
            <div style={{
                fontSize: '1.2rem',
                fontWeight: 500,
                width: '100%',
                textAlign: 'left',
                marginBottom: 10,
                paddingLeft: 6
            }}>
                {title}
            </div>
            <TableContainer id='areaList' sx={{
                height: 420, backgroundColor: '#111', margin: 'auto'
            }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{
                                padding: '4px 10px 4px 12px',
                                fontWeight: 700,
                                textAlign: 'right'
                            }}>#</TableCell>
                            <TableCell style={{padding: '4px 0px', fontWeight: 700}}>Lock</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataset.map((topLock, index) =>
                            <TableRow key={index} index={index}>
                                <TableCell key={index + 1} style={bodyStyle}
                                           sx={{
                                               textAlign: 'right',
                                               padding: '0px',
                                               width: 34,
                                               verticalAlign:'top'
                                           }}>{index + 1}</TableCell>
                                <TableCell key={topLock.lock} style={bodyStyle} sx={{textOverflow: 'ellipsis'}}>
                                    {topLock.lock}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    )
}

export default CollectionTopLocksList