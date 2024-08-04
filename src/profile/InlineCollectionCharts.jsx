import React, {useContext, useMemo} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useWindowSize from '../util/useWindowSize'
import CollectionStatsBarProfile from './CollectionStatsBarProfile.jsx'
import CollectionBeltBar from './CollectionBeltBar.jsx'
import {uniqueBelts} from '../data/belts'
import {useParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext.jsx'

function InlineCollectionCharts({profile, entries}) {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const userText = userId === user?.uid ? 'You' : 'User'

    console.log('entries', entries)
    const chartData = useMemo(() => {
        const beltList = uniqueBelts.concat('Unranked')

        const beltDistribution = entries
            .filter(({collection}) => collection.some(r=> ['Own','Picked', 'Recorded'].includes(r)))
            .map(({belt}) => belt.includes('Black') ? 'Black' : belt)
            .reduce((acc, val) => {
                if (!acc[val]) acc[val] = 0
                acc[val]++
                return acc
            }, {})

        return beltList.map(belt => ({
            id: belt,
            label: belt,
            count: beltDistribution[belt] || 0,
            value: beltDistribution[belt] || 0
        }))
    }, [entries])

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, borderRadius: 0}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', borderRadius: 0}

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
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
    const barDivWidth = !smallWindow ? '50%' : '100%'
    const pieDivWidth = !smallWindow ? '50%' : '100%'

    const barDivHeight = mobileSmall ? 200
        : smallWindow ? 210
            : 180

    const pieDivHeight = mobileSmall ? 170
        : mobileMedium ? 170
            : mobileLarge ? 170
                : smallWindow ? 170
                    : 170

    return (
        <Card style={style} sx={{paddingBottom: 5}}>
            <CardContent style={{paddingTop: 0, paddingLeft: 8}}>
                <div style={{textAlign: 'center'}}>
                    <div style={combinedDivStyle}>
                        <div style={{width: barDivWidth, verticalAlign: 'top', height: barDivHeight}}>
                            <CollectionStatsBarProfile lockCollection={profile} userText={userText}
                                                       collectionBarHeight={170}/>
                        </div>
                        <div style={{width: pieDivWidth, height: pieDivHeight, marginTop: '0px'}}>
                            <CollectionBeltBar beltData={chartData}/>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default InlineCollectionCharts
