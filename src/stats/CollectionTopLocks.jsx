import React from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import statsCollectionSummary from '../data/statsCollectionsSummary.json'
import CollectionTopLocksList from './CollectionTopLocksList.jsx'

const CollectionTopLocks = () => {

    const data = statsCollectionSummary

    const {width} = useWindowSize()
    const smallWindow = width <= 560

    const divStyle = {
        width: '100%', padding: '0px', marginBottom: 12, alignItems: 'center',
        marginLeft: 'auto', marginRight: 'auto'
    }
    const divFlexStyle = !smallWindow ? {display: 'flex'} : {}
    const combinedDivStyle = {
        ...divStyle,
        ...divFlexStyle
    }

    return (
        <div style={{textAlign: 'center'}}>
            <div style={combinedDivStyle}>
                <CollectionTopLocksList dataset={data.topLocksOwn} title='Owned'/>
                <CollectionTopLocksList dataset={data.topLocksPicked} title='Picked'/>
            </div>
            <div style={combinedDivStyle}>
                <CollectionTopLocksList dataset={data.topLocksRecorded} title='Recorded'/>
                <CollectionTopLocksList dataset={data.topLocksWishlist} title='Wishlist'/>
            </div>
        </div>
    )
}

export default CollectionTopLocks
