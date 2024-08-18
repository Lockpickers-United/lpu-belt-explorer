import React, {useContext} from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme} from './chartDefaults'
import useWindowSize from '../util/useWindowSize'
import AuthContext from '../app/AuthContext'

function CollectionStatsBar({data, lockCollection, userText, collectionBarHeight}) {
    const {isLoggedIn} = useContext(AuthContext)

    const listStats = data.collectionsSummary.listStats.data[0]
    const own = lockCollection.own ? lockCollection.own.length : 0
    const picked = lockCollection.picked ? lockCollection.picked.length : 0
    const scorecard = lockCollection.recordedLocks ? lockCollection.recordedLocks.length : 0
    const wishlist = lockCollection.wishlist ? lockCollection.wishlist.length : 0
    const userSaves = own + picked + scorecard + wishlist

    const userStats = userSaves ? {
        own: own,
        picked: picked,
        scorecard: scorecard,
        wishlist: wishlist
    } : {
        own: 0,
        picked: 0,
        scorecard: 0,
        wishlist: 0
    }
    const averages = {
        own: listStats['aveOwn'],
        picked: listStats['avePicked'],
        scorecard: listStats['aveScorecard'],
        wishlist: listStats['aveWishlist']
    }
    const maxes = {
        own: listStats['maxOwn'],
        picked: listStats['maxPicked'],
        scorecard: listStats['maxScorecard'],
        wishlist: listStats['maxWishlist']
    }
    const aveA = {
        own: Math.min(averages.own, userStats.own),
        picked: Math.min(averages.picked, userStats.picked),
        scorecard: Math.min(averages.scorecard, userStats.scorecard),
        wishlist: Math.min(averages.wishlist, userStats.wishlist)
    }
    const aveB = {
        own: userStats.own > averages.own ? 0 : averages.own - aveA.own,
        picked: userStats.picked > averages.picked ? 0 : averages.picked - aveA.picked,
        scorecard: userStats.scorecard > averages.scorecard ? 0 : averages.scorecard - aveA.scorecard,
        wishlist: userStats.wishlist > averages.wishlist ? 0 : averages.wishlist - aveA.wishlist
    }
    const aveLine = {
        own: 2, picked: 2, scorecard: 2, wishlist: 2
    }
    const remainder = {
        own: Math.max(userStats.own - (aveA.own + aveB.own + aveLine.own), 0),
        picked: Math.max(userStats.picked - (aveA.picked + aveB.picked + aveLine.picked), 0),
        scorecard: Math.max(userStats.scorecard - (aveA.scorecard + aveB.scorecard + aveLine.scorecard), 0),
        wishlist: Math.max(userStats.wishlist - (aveA.wishlist + aveB.wishlist + aveLine.wishlist), 0)
    }
    const max = {
        own: Math.min(maxes.own - userStats.own, maxes.own - averages.own - aveLine.own),
        picked: Math.min(maxes.picked - userStats.picked, maxes.picked - averages.picked - aveLine.picked),
        scorecard: Math.min(maxes.scorecard - userStats.scorecard, maxes.scorecard - averages.scorecard - aveLine.scorecard),
        wishlist: Math.min(maxes.wishlist - userStats.wishlist, maxes.wishlist - averages.wishlist - aveLine.wishlist)
    }

    const lists = ['own', 'picked', 'scorecard', 'wishlist']
    const barData = lists.map((list, index) =>
        (
            {
                row: lists[index],
                'Average A': aveA[list],
                'Average B': aveB[list],
                'Average': aveLine[list],
                'USER': remainder[list],
                'Top 10': max[list]
            }
        )
    )

    const {width} = useWindowSize()
    const smallWindow = width <= 560

    const chartHeight = collectionBarHeight
    const chartMargin = !smallWindow
        ? {top: 10, right: 20, bottom: 50, left: 55}
        : {top: 10, right: 20, bottom: 50, left: 55}

    const barColors =
        ['#3c90c5', '#aaa', '#000',
            '#3c90c5', '#aaa']

    const legendItems = isLoggedIn && lockCollection
        ? [{title:userText, color: '#3c90c5', width: '14px'}]
        : []
    legendItems.push({title: 'Average', color: '#000', width: '35px'},
        {title: 'Max', color: '#aaaaaa', width: '120px'})

    const Legend = ({items}) => (
        <div className='chart-legend' style={{
            display: 'flex', fontSize: '.9rem', color: '#ddd', marginTop:13
        }}>
            <div style={{width: '100%'}}></div>
            {items.map(item => (
                    <div key={item.title} style={{display: 'flex', padding: '0px 18px 24px 18px'}}>
                        <div style={{backgroundColor: item.color,
                            height: 15, width: 15,
                            margin: '2px 6px 0px 0px',
                            border: '1px solid #555'
                        }}></div>
                        <div style={{textAlign: 'left', width: item.width}}>{item.title}</div>
                    </div>
                )
            )}
            <div style={{width: '100%'}}></div>
        </div>
    )

    return (
        <React.Fragment>
            <div style={{height: chartHeight}}>
                <ResponsiveBar
                    data={barData}
                    keys={['Average A', 'Average B', 'Average', 'USER', 'Top 10']}
                    theme={primaryTheme}
                    indexBy='row'
                    margin={chartMargin}
                    padding={0.2}
                    valueScale={{type: 'linear'}}
                    colors={barColors}
                    enableLabel={false}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: '00',
                        legend: 'Saves',
                        legendPosition: 'middle',
                        legendOffset: -45,
                        legendOpacity: 0.9

                    }}
                    enableGridY={false}
                    isInteractive={false}
                    animate={false}
                />
            </div>

            <Legend items={legendItems}/>
        </React.Fragment>
    )
}

export default CollectionStatsBar
