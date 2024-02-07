import React from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminStatsTable from '../AdminStatsTable'

const TopLocks = ({data}) => {

    const {
        topLocksOwn,
        topLocksPicked,
        topLocksRecorded,
        topLocksWishlist
    } = data.topLocksFull

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
    const fontSize = '.83rem'


    return (
        <div style={{textAlign: 'center'}}>
            <div style={combinedDivStyle}>
                <AdminStatsTable tableData={topLocksOwn} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
                <div style={{width:'75px'}}>&nbsp;</div>
                <AdminStatsTable tableData={topLocksPicked} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
            </div>
            <div style={combinedDivStyle}>
                <AdminStatsTable tableData={topLocksRecorded} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
                <div style={{width: '75px'}}>&nbsp;</div>
                <AdminStatsTable tableData={topLocksWishlist} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
            </div>
        </div>
    )
}

export default TopLocks
