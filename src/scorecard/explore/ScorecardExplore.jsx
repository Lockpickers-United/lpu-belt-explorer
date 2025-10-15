import React from 'react'
import useWindowSize from '../../util/useWindowSize'
import UserCohorts from './UserCohorts.jsx'
import ScorecardLocks from './ScorecardLocks.jsx'
import BeltFlowSankey from '../../tools/testPage/BeltFlowSankey.jsx'

export default function ScorecardExplore({data}) {

    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const headerStyle = {margin: '46px 0px 26px 0px', width: '100%', backgroundColor: '#000', textAlign: 'center'}
    const firstHeaderStyle = {margin: '0px 0px 14px 0px', width: '100%', backgroundColor: '#000', textAlign: 'center'}

    return (
        <div style={{
            minWidth: '320px', maxWidth: 720, height: '100%',
            padding: pagePadding, backgroundColor: '#000',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', fontWeight: 600
        }}>

            <div style={firstHeaderStyle} role='heading' aria-label='User Belt Flows'>
                User Belt Flows
                <div style={{fontSize: '0.9rem', fontWeight: 400}}>Discord users since Nov. 2019</div>
            </div>
            <BeltFlowSankey/>

            <div style={headerStyle} role='heading' aria-label='User Drilldown'>User Drilldown</div>
            <UserCohorts data={data}/>


            <div style={headerStyle} role='heading'>Scorecard Locks</div>
            <ScorecardLocks data={data}/>

        </div>
    )
}
