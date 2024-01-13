import React, {useCallback, useState} from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import {ToggleButtonGroup} from '@mui/material'
import StatsToggleButton from './StatsToggleButton.jsx'
import useWindowSize from '../util/useWindowSize'
import popularAreas from '../data/statsPopularAreas.json'
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

    const [dataset, setDataset] = useState(popularCountries)
    const [map, setMap] = useState(mapWorld)
    const handleButtonClick = useCallback((newDataSet) => {
        document.getElementById('areaList').scrollTop = 0
        setDataset(newDataSet)

        newDataSet === popularCountries && setMap(mapWorld)
        || newDataSet === popularEuropeanCountries && setMap(mapEurope)
        || newDataSet === popularStates && setMap(mapUSA)

    }, [popularCountries, popularEuropeanCountries, popularStates])

    return (
        <div style={{textAlign: 'center'}}>

                <ToggleButtonGroup variant='outlined'>

                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        dataset={dataset}
                        newDataset={popularCountries}
                        value={dataset}
                        label='Worldwide'
                    >Worldwide</StatsToggleButton>

                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        dataset={dataset}
                        value={dataset}
                        newDataset={popularEuropeanCountries}
                        label='Europe'
                    >Europe</StatsToggleButton>

                    <StatsToggleButton
                        handleButtonClick={handleButtonClick}
                        dataset={dataset}
                        value={dataset}
                        newDataset={popularStates}
                        label='US States'
                    >US States</StatsToggleButton>

                </ToggleButtonGroup>

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
                                    {dataset.data?.map((area, index) =>
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
    )
}
export default PopularAreas
