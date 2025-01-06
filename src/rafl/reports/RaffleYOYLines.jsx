import React from 'react'
import RaffleReportLine from './RaffleReportLine'
import {setDeepPush} from '../../util/setDeep'

/**
 * @property cumDonorsUnique
 * @property cumulativeDonations
 * @property cumulativeDonors
 */

const RaffleYOYLines = ({data}) => {

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

    const chartHeight = 300

    if (Object.keys(data).length === 0) return (
        <div style={{color: '#fff', textAlign: 'center', fontSize: '1.2rem', margin: '20px 0px 0px 0px'}}>
            No data available
        </div>
    )

    return (
        <React.Fragment>
            <div style={subHeadStyle}>YOY Donations (cumulative)</div>
            <div style={{height: chartHeight, width: '100%'}}>
                <RaffleReportLine
                    chartdata={[
                        {id: '2025', data: lineData.cumulativeDonations},
                        {id: '2024', data: cumulativeDonations2024}
                    ]}
                    chartHeight={chartHeight} showAxisBottom={true}
                    colors={['#4fa720', '#777']} tickValues={5}
                />
            </div>
        </React.Fragment>
    )
}

const cumulativeDonations2024 =  [
    {x: '2025-01-01 23:59:59', y: 901 },
    {x: '2025-01-02 23:59:59', y: 1336 },
    {x: '2025-01-03 23:59:59', y: 1536 },
    {x: '2025-01-04 23:59:59', y: 1798 },
    {x: '2025-01-05 23:59:59', y: 2948 },
    {x: '2025-01-06 23:59:59', y: 2948 },
    {x: '2025-01-07 23:59:59', y: 3766 },
    {x: '2025-01-08 23:59:59', y: 4446 },
    {x: '2025-01-09 23:59:59', y: 4846 },
    {x: '2025-01-10 23:59:59', y: 5230 },
    {x: '2025-01-11 23:59:59', y: 5480 },
    {x: '2025-01-12 23:59:59', y: 5681 },
    {x: '2025-01-13 23:59:59', y: 5952 },
    {x: '2025-01-14 23:59:59', y: 6157 },
    {x: '2025-01-15 23:59:59', y: 6217 },
    {x: '2025-01-16 23:59:59', y: 6283 },
    {x: '2025-01-17 23:59:59', y: 6288 },
    {x: '2025-01-18 23:59:59', y: 6848 },
    {x: '2025-01-19 23:59:59', y: 6998 },
    {x: '2025-01-20 23:59:59', y: 7201 },
    {x: '2025-01-21 23:59:59', y: 7975 },
    {x: '2025-01-22 23:59:59', y: 10897 },
    {x: '2025-01-23 23:59:59', y: 12055 },
    {x: '2025-01-24 23:59:59', y: 14413 },
    {x: '2025-01-25 23:59:59', y: 15133 },
    {x: '2025-01-26 23:59:59', y: 16728 },
    {x: '2025-01-27 23:59:59', y: 17209 },
    {x: '2025-01-28 23:59:59', y: 21677 },
    {x: '2025-01-29 23:59:59', y: 28598 },
    {x: '2025-01-30 23:59:59', y: 30012 },
    {x: '2025-01-31 23:59:59', y: 33701 }
]

export default RaffleYOYLines
