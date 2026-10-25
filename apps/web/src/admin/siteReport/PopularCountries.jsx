import React from 'react'
import useWindowSize from '../../util/useWindowSize'
import AdminStatsTable from '../AdminStatsTable'

const PopularCountries = ({data}) => {

    const countryTable1 = data.popularCountries1
    const countryTable2 = data.popularCountries2

    const {width} = useWindowSize()
    const smallWindow = width <= 560

    const divStyle = {
        width: '100%', padding: '0px', marginBottom: 12, alignItems: 'center', verticalAlign:'top',
        marginLeft: 'auto', marginRight: 'auto'
    }
    const divFlexStyle = !smallWindow ? {display: 'flex'} : {}
    const combinedDivStyle = {
        ...divStyle,
        ...divFlexStyle
    }

    const tableWidth = '400px'
    const fontSize = '.95rem'

    return (
        <div style={{textAlign: 'center'}}>
            <div style={combinedDivStyle}>
                <AdminStatsTable tableData={countryTable1} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
                <div style={{width:'75px'}}>&nbsp;</div>
                <AdminStatsTable tableData={countryTable2} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
            </div>
        </div>
    )
}

export default PopularCountries
