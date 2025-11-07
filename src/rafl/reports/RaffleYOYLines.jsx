import React, {useContext} from 'react'
import RaffleYOYLine from './RaffleYOYLine'
import useWindowSize from '../../util/useWindowSize.jsx'
import RaffleContext from '../RaffleContext.jsx'

/**
 @property cumulativeDonations2024
 * @property cumulativeDonations2025
 */


const RaffleYOYLines = () => {
    const {isMobile} = useWindowSize()
    const {summary} = useContext(RaffleContext)

    const subHeadStyle = {
        margin: '30px 0px 0px 0px',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: '1.2rem'
    }
    const chartHeight = !isMobile ? 300 : 240

    if (summary?.lineDataCurrent?.cumulativeDonations?.length === 0) return (
        <div style={{color: '#fff', textAlign: 'center', fontSize: '1.2rem', margin: '20px 0px 0px 0px'}}>
            No data available
        </div>
    )

    return (
        <React.Fragment>
            <div style={subHeadStyle}>Donations (cumulative)</div>
            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleYOYLine
                    chartdata={[
                        {id: '2026', data: summary.lineDataCurrent.cumulativeDonations},
                        {id: '2025', data: summary.historicalLineData.cumulativeDonations2025 || []},
                        {id: '2024', data: summary.historicalLineData.cumulativeDonations2024 || []},
                    ]}
                    chartHeight={chartHeight} showAxisBottom={true}
                    colors={['#57bb20', '#777', '#555']} tickValues={5}
                />
            </div>
        </React.Fragment>
    )
}

export default RaffleYOYLines
