import React from 'react'
import RaffleReportLine from './RaffleReportLine'
import {setDeepPush} from '../../util/setDeep'

/**
 * @property cumDonorsUnique
 * @property cumulativeDonations
 * @property cumulativeDonors
 */

const RaffleReportHistoricalLines = ({data}) => {

    const lineData = Object.keys(data)
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc, day) => {
            const date = day + ' 23:59:59'
            acc.donorsCum = acc.donorsCum + data[day].totalDonors ||data[day].totalDonors
            setDeepPush(acc, ['totalDonors'], {x: date, y: data[day].totalDonorCountUnique})
            setDeepPush(acc, ['cumulativeDonors'], {x: date, y: data[day].cumDonorsUnique})

            acc.donationsCum = acc.donationsCum + data[day].totalDonations ||data[day].totalDonations
            setDeepPush(acc, ['totalDonations'], {x: date, y: data[day].totalDonations})
            setDeepPush(acc, ['cumulativeDonations'], {x: date, y: acc.donationsCum})

            return acc
        }, [])

    const subHeadStyle = {margin: '30px 0px 0px 0px', width: '100%', textAlign: 'center', color: '#fff', fontSize:'1.2rem'}

    const chartHeight = 120

    if (Object.keys(data).length === 0) return (
        <div style={{color: '#fff', textAlign: 'center', fontSize: '1.2rem', margin: '20px 0px 0px 0px'}}>
            No data available
        </div>
    )


    return (
        <React.Fragment>

            <div style={subHeadStyle}>Donations</div>
            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[{id: 'Donations Cumulative', data: lineData.cumulativeDonations}]}
                    chartHeight={chartHeight} showAxisBottom={false}
                    colors={['#4fa720']} tickValues={5}
                />
            </div>
            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[{id: 'Donations', data: lineData.totalDonations}]}
                    chartHeight={chartHeight} showAxisBottom={true}
                    colors={['#3a7919']} tickValues={2} curve={'step'}
                />
            </div>
            <div style={subHeadStyle}>Unique Donors</div>

            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[{id: 'Donors Cumulative', data: lineData.cumulativeDonors}]}
                    chartHeight={chartHeight} showAxisBottom={false}
                    colors={['#5265ed', '#082fd1', '#4fa720']}
                />
            </div>
            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[{id: 'Donors', data: lineData.totalDonors}]}
                    chartHeight={chartHeight} showAxisBottom={true}
                    colors={['#082fd1', '#4fa720']} tickValues={2} curve={'step'}
                />
            </div>

        </React.Fragment>
    )
}

export default RaffleReportHistoricalLines
