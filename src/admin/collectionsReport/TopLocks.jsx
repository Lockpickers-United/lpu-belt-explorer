import React, {useContext} from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'
import AdminStatsTable from '../AdminStatsTable'
import ReportsContext from '../ReportsContext.jsx'

const TopLocks = ({cohort}) => {
    const {data} = useContext(ReportsContext)

    const columns = [
        {name: '#', id: 'rank', align: 'center'},
        {name: 'Lock', id: 'name', align: 'left'},
        {name: 'Saves', id: 'saveCount', align: 'center'}
    ]

    // TODO: Move to ReportsContext if shared with Stats page
    const topLocksOwn = {title: 'Own', columns: columns, data: data.collectionsStatsCurrent[cohort].listStats.own.topItems}
    const topLocksPicked = {title: 'Picked', columns: columns, data: data.collectionsStatsCurrent[cohort].listStats.picked.topItems}
    const topLocksWishlist = {title: 'Wishlist', columns: columns, data: data.collectionsStatsCurrent[cohort].listStats.wishlist.topItems}
    const topLocksScorecard = {
        title: 'Scorecard',
        columns: columns,
        data: data.collectionsStatsCurrent[cohort].listStats.recordedLocks.topItems.slice(0, 25)
    }

    const {width} = useWindowSize()
    const smallWindow = width <= 560

    const divStyle = {
        width: '100%', padding: '0px', marginBottom: 12, alignContent: 'top', verticalAlign: 'top',
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
                <div style={{width: '75px'}}>&nbsp;</div>
                <AdminStatsTable tableData={topLocksPicked} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
            </div>
            <div style={combinedDivStyle}>
                <AdminStatsTable tableData={topLocksWishlist} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
                <div style={{width: '75px'}}>&nbsp;</div>
                <AdminStatsTable tableData={topLocksScorecard} tableWidth={tableWidth} fontSize={fontSize} wrap={true}/>
            </div>
        </div>
    )
}

export default TopLocks
