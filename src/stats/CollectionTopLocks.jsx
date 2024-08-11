import React from 'react'
import useWindowSize from '../util/useWindowSize'
import CollectionTopLocksList from './CollectionTopLocksList'

function CollectionTopLocks({data}) {
    const {
        topLocksOwn,
        topLocksPicked,
        topLocksScorecard,
        topLocksWishlist
    } = data.collectionsSummary.topLocksFull

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
                <CollectionTopLocksList dataset={topLocksOwn.data} title='Owned'/>
                <CollectionTopLocksList dataset={topLocksPicked.data} title='Picked'/>
            </div>
            <div style={combinedDivStyle}>
                <CollectionTopLocksList dataset={topLocksWishlist.data} title='Wishlist'/>
                <CollectionTopLocksList dataset={topLocksScorecard.data} title='Scorecard'/>
            </div>
        </div>
    )
}

export default CollectionTopLocks
