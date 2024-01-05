import React from 'react'
import useWindowSize from '../util/useWindowSize'
import LockViewsLine from './LockViewsLine'

function StatsPage() {
    const {width} = useWindowSize()
    const smallWidth = width < 500
    const chartHeight = !smallWidth ? 350 : 300

    return (
        <React.Fragment>
            <div style={{
                minWidth: '390px', maxWidth: 720, height: '100%',
                padding: '24px', backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto',
                fontSize: '1.5rem'
            }}>
                <div>Weekly Lock Views</div>
                <LockViewsLine chartHeight={chartHeight}/>
            </div>
        </React.Fragment>
    )
}

export default StatsPage
