import React from 'react'
import useWindowSize from '../util/useWindowSize'
import CollectionTopLocksList from './CollectionTopLocksList'

function CollectionTopLocks({data}) {

    const topLocksOwn = data.collectionsStatsCurrent.allUsers.listStats.own.topItems
    const topLocksPicked = data.collectionsStatsCurrent.allUsers.listStats.picked.topItems
    const topLocksWishlist = data.collectionsStatsCurrent.allUsers.listStats.wishlist.topItems
    const topLocksScorecard = data.collectionsStatsCurrent.allUsers.listStats.recordedLocks.topItems.slice(0, 25)

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
                <CollectionTopLocksList dataset={topLocksOwn} title='Owned'/>
                <CollectionTopLocksList dataset={topLocksPicked} title='Picked'/>
            </div>
            <div style={combinedDivStyle}>
                <CollectionTopLocksList dataset={topLocksWishlist} title='Wishlist'/>
                <CollectionTopLocksList dataset={topLocksScorecard} title='Scorecard'/>
            </div>
        </div>
    )
}

export default CollectionTopLocks
