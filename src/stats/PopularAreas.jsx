import React, {useState} from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import {Button, ButtonGroup} from '@mui/material'
import useWindowSize from '../util/useWindowSize'
import popularAreas from '../data/popularAreasData.json'
import mapWorld from './maps/mapWorld.gif'
import mapEurope from './maps/mapEurope.gif'
import mapUSA from './maps/mapUSA.gif'

const PopularAreas = () => {
    const popularCountries = popularAreas.popularCountries
    const popularEuropeanCountries = popularAreas.popularEuropeanCountries
    const popularStates = popularAreas.popularStates

    const {width} = useWindowSize()
    const smallWidth = width < 500
    const midWidth = width < 700
    const divHeight = !midWidth ? 400 : 280
    const leaderboardHeight = !midWidth ? 375 : 260
    const mapWidth = !smallWidth ? 450 : 320
    const bodyStyle = {border: 0, padding: '4px 8px 0px 0px', fontWeight: 400}

    const divStyle = {
        width: '100%', padding: '8px 16px', marginTop: 16, alignItems: 'center',
        marginLeft: 'auto', marginRight: 'auto'
    }
    const divFlexStyle = !midWidth ? {display: 'flex'} : {}
    const combinedDivStyle = {
        ...divStyle,
        ...divFlexStyle
    }

    const [data, setData] = useState(popularCountries)
    const [map, setMap] = useState(mapWorld)
    const changeData = (newData, map) => {
        document.getElementById('areaList').scrollTop = 0
        setData(newData)
        setMap(map)
    }

    return (
        <React.Fragment>
            <div style={{textAlign: 'center'}}>

                <ButtonGroup variant='outlined' style={{backgroundColor: '#222', outlineColor: '#222'}}>
                    <Button
                        onClick={() => {
                            changeData(popularCountries, mapWorld)
                        }}
                        style={{color: data === popularCountries ? '#fff' : '#666'}}
                    >Worldwide</Button>
                    <Button
                        onClick={() => {
                            changeData(popularEuropeanCountries, mapEurope)
                        }}
                        style={{color: data === popularEuropeanCountries ? '#fff' : '#666'}}
                    >Europe</Button>
                    <Button
                        onClick={() => {
                            changeData(popularStates, mapUSA)
                        }}
                        style={{color: data === popularStates ? '#fff' : '#666'}}
                    >US States</Button>
                </ButtonGroup>

                <div style={combinedDivStyle}>

                    <div style={{
                        backgroundColor: '#000', border: '1px solid #666', padding: 12,
                        align: 'center', margin: '10px 0px 0px 0px', width: 200,
                        height: divHeight, marginLeft: 'auto', marginRight: 'auto'
                    }}>
                        <TableContainer id='areaList' sx={{
                            height: leaderboardHeight, backgroundColor: '#111', margin: 'auto'
                        }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{
                                            padding: '4px 10px 4px 12px',
                                            fontWeight: 700,
                                            textAlign: 'right'
                                        }}>#</TableCell>
                                        <TableCell style={{padding: '4px 0px', fontWeight: 700}}>Area</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.data?.map((area, index) =>
                                        <TableRow key={index} index={index}>
                                            <TableCell key={index + 1} style={bodyStyle}
                                                       sx={{
                                                           textAlign: 'right',
                                                           padding: '0px',
                                                           width: 34
                                                       }}>{index + 1}</TableCell>
                                            <TableCell key={area.area} style={bodyStyle}>{area.area}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div style={{flexGrow: 1, width: mapWidth}}>
                        <img id='mapImage' alt='map' src={map} width={mapWidth}/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default PopularAreas