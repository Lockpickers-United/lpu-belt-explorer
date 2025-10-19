import React, {useContext} from 'react'
import RaffleReportLine from './RaffleReportLine'
import RaffleContext from '../RaffleContext.jsx'

/**
 * @property totalDonors
 * @property totalDonorCountUnique
 * @property cumDonorsUnique
 * @property cumulativeUniqueDonors
 */

const RaffleReportDonationsDonorsLines = () => {
    const {summary} = useContext(RaffleContext)

    const subHeadStyle = {margin: '30px 0px 0px 0px', width: '100%', textAlign: 'center', color: '#fff', fontSize:'1.2rem'}
    const chartHeight = 120

    if (summary.lineDataCurrent.cumulativeDonations.length === 0) return (
        <div style={{color: '#fff', textAlign: 'center', fontSize: '1.2rem', margin: '20px 0px 0px 0px'}}>
            No data available
        </div>
    )

    return (
        <React.Fragment>

            <div style={subHeadStyle}>Donations</div>
            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[{id: 'Donations Cumulative', data: summary.lineDataCurrent.cumulativeDonations}]}
                    chartHeight={chartHeight} showAxisBottom={false}
                    colors={['#4fa720']} tickValues={5}
                />
            </div>
            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[{id: 'Donations', data: summary.lineDataCurrent.totalDonations}]}
                    chartHeight={chartHeight} showAxisBottom={true}
                    colors={['#3a7919']} tickValues={2} curve={'step'}
                />
            </div>
            <div style={subHeadStyle}>Unique Donors</div>

            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[{id: 'Donors Cumulative', data: summary.lineDataCurrent.cumulativeUniqueDonors}]}
                    chartHeight={chartHeight} showAxisBottom={false}
                    colors={['#5265ed', '#082fd1', '#4fa720']}
                />
            </div>
            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[{id: 'Donors', data: summary.lineDataCurrent.totalEntries}]}
                    chartHeight={chartHeight} showAxisBottom={true}
                    colors={['#082fd1', '#4fa720']} tickValues={2} curve={'step'}
                />
            </div>

        </React.Fragment>
    )
}

export default RaffleReportDonationsDonorsLines
