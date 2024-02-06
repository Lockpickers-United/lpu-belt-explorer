import React, {useCallback, useMemo, useState} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ChoiceButtonGroup from '../util/ChoiceButtonGroup'
import useWindowSize from '../util/useWindowSize'

function PopularAreas({data}) {

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

    const options = useMemo(() => {
        const {popularCountries, popularEuropeanCountries, popularStates} = data.popularAreas
        return [
            {label: 'Worldwide', data: popularCountries, map: mapWorld},
            {label: 'Europe', data: popularEuropeanCountries, map: mapEurope},
            {label: 'US States', data: popularStates, map: mapUSA}
        ]
    }, [data])
    const [selected, setSelected] = useState(options[0])
    const handleChange = useCallback(newValue => setSelected(newValue), [])

    return (
        <div style={{textAlign: 'center'}}>
            <ChoiceButtonGroup options={options} onChange={handleChange}/>

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
                                {selected.data.data.map((area, index) =>
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
                    <img id='mapImage' alt='map' src={selected.map} width={mapWidth}/>
                </div>
            </div>
        </div>
    )
}

const mapWorld = 'https://explore.lpubelts.com/maps/mapWorld.gif'
const mapEurope = 'https://explore.lpubelts.com/maps/mapEurope.gif'
const mapUSA = 'https://explore.lpubelts.com/maps/mapUSA.gif'

export default PopularAreas
