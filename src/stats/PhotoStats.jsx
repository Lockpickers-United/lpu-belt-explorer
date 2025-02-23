import React from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import useWindowSize from '../util/useWindowSize'

function PhotoStats({data}) {
    const {width} = useWindowSize()
    const smallWidth = width < 500
    const midWidth = width < 700

    const divStyle = !midWidth ? {display: 'flex', padding: '0xp 20px', maxWidth:660} : {padding: '0xp 20px'}
    const divSpacing = !smallWidth ? '10px' : '32px'
    const leaderboardWidth = !midWidth ? 155 : 255
    const statsMaxWidth = !midWidth ? 360 : 330

    const headerStyle = {padding: '0px', fontWeight: 700, backgroundColor: '#000'}
    const bodyStyle = {border: 0, padding: '4px 8px 0px 0px', fontWeight: 400}
    const bodyStyleBold = {border: 0, padding: '4px 8px 0px 0px', fontWeight: 700}

    const {photoSegments, topPhotographers, uniqueImages, contributors} = data.lockStats.photoStats

    return (
        <React.Fragment>
            <div style={divStyle}>
                <div style={{
                    border: '1px solid #666', padding: 12, flexGrow: 1,
                    margin: '10px 0px 0px 32px', minWidth: '300px', maxWidth: statsMaxWidth, height: 230
                }}>
                    <div style={{
                        border: '1px solid #999', borderRadius: 20, paddingTop: 5, width: 40, height: 40,
                        margin: '-33px 0px 0px -33px', backgroundColor: '#000', textAlign: 'center'
                    }}>
                        <PhotoCameraIcon style={{fontSize: 'x-large'}}/>
                    </div>
                    <TableContainer id='photoStats' style={{padding: '0px 0px 0px 4px', maxWidth: '240px'}}>
                        <Table>
                            <TableBody>
                                <TableRow key={1} index={1}>
                                    <TableCell key={'images'} style={bodyStyleBold} sx={{maxWidth: 108}}>Unique
                                        Images</TableCell>
                                    <TableCell key={'imageCount'}
                                               style={bodyStyleBold}>{uniqueImages}</TableCell>
                                </TableRow>
                                <TableRow key={2} index={2}>
                                    <TableCell key={'contribs'} style={bodyStyleBold} sx={{maxWidth: 108}}>Individual
                                        Contributors</TableCell>
                                    <TableCell key={'contribCount'}
                                               style={bodyStyleBold}>{contributors}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{height: 16}}/>
                    <TableContainer id='areaList' style={{padding: '0px 0px 0px 4px', maxWidth: '400px'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={headerStyle}>Segment</TableCell>
                                    <TableCell style={headerStyle} sx={{textAlign: 'center'}}>Count</TableCell>
                                    <TableCell style={headerStyle} sx={{textAlign: 'center'}}>w/Media</TableCell>
                                    <TableCell style={headerStyle} sx={{textAlign: 'center'}}>Coverage</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {photoSegments.map((segment, index) =>
                                    <TableRow key={index} index={index}>
                                        <TableCell key={index + 1} style={bodyStyle}>{segment.segment}</TableCell>
                                        <TableCell style={bodyStyle}
                                                   sx={{textAlign: 'center'}}>{segment.count}</TableCell>
                                        <TableCell style={bodyStyle}
                                                   sx={{textAlign: 'center'}}>{segment.media}</TableCell>
                                        <TableCell style={bodyStyle}
                                                   sx={{textAlign: 'center'}}>{segment.coverage}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>

                <div style={{
                    backgroundColor: '#000', border: '1px solid #666', padding: 12,
                    margin: `10px 0px 0px ${divSpacing}`, minWidth: '260px', maxWidth: '330px', height: 230
                }}>
                    <TableContainer sx={{
                        height: 200, backgroundColor: '#111',
                        marginLeft: 'auto', marginRight: 'auto', width:{leaderboardWidth}
                    }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={headerStyle}>Top Contributors</TableCell>
                                    <TableCell style={headerStyle} sx={{textAlign: 'center'}}>Images</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {topPhotographers.map((contributor, index) =>
                                    <TableRow key={index}>
                                        <TableCell style={bodyStyle} sx={{}}>
                                            &nbsp;&nbsp;{contributor.contributor}
                                        </TableCell>
                                        <TableCell style={bodyStyle} sx={{textAlign: 'center'}}>
                                            {contributor.images}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </React.Fragment>
    )
}
export default PhotoStats
