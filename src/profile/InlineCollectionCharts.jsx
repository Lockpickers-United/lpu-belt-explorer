import React, {useContext, useMemo} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useWindowSize from '../util/useWindowSize'
import CollectionStatsBarProfile from './CollectionStatsBarProfile.jsx'
import CollectionBeltBar from './CollectionBeltBar.jsx'
import getAnyCollection from '../util/getAnyCollection'
import CardHeader from '@mui/material/CardHeader'
import DataContext from '../context/DataContext.jsx'
import {uniqueBelts} from '../data/belts'
import {useParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext.jsx'

function InlineCollectionCharts({profile}) {

    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const userProfile = profile
    const userText = userId===user?.uid ? 'You' : 'User'
    const titleText = userId===user?.uid ? 'Your Collection Stats' : 'Collection Stats'

    const {getEntryFromId} = useContext(DataContext)
    const anyCollection = useMemo(() => getAnyCollection(profile), [profile])
    const beltList = uniqueBelts.concat('Unranked')

    const beltDistribution = new Map()
    beltList.forEach(belt => {
        beltDistribution[belt] = 0
        beltDistribution['Unranked'] = 0
    })

    anyCollection.forEach(lockId => {
        let thisBelt = getEntryFromId(lockId).belt
        if (thisBelt.includes('Black')) { thisBelt = 'Black' }
        beltDistribution[thisBelt]++
    })

    let chartData = []
    beltList.forEach(belt => {
        let beltData = new Map()
        beltData['label'] = belt
        beltData['id'] = belt
        beltData['count'] = beltDistribution[belt]
        beltData['value'] = beltDistribution[belt]
        chartData.push(beltData)
    })

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
        <Card style={style} sx={{paddingBottom: 0, paddingTop: '20px'}}>
            <CardHeader
                title={titleText}
            />
            <CardContent style={{paddingTop: 0, paddingLeft: 8}}>
                <div style={{textAlign: 'center'}}>
                    <div style={combinedDivStyle}>
                        <div style={{width: barDivWidth, verticalAlign: 'top', height: barDivHeight}}>
                            <CollectionStatsBarProfile lockCollection={userProfile} userText={userText} collectionBarHeight={170}/>
                        </div>
                        <div style={{width: pieDivWidth, height: pieDivHeight, marginTop:'0px'}}>
                            <CollectionBeltBar beltData={chartData}/>
                        </div>
                    </div>
                </div>


            </CardContent>
        </Card>
    )
}

export default InlineCollectionCharts
