import React from 'react'
import HourlyLine from './HourlyLine.jsx'

const FirebaseHourlyLine = ({data}) => {
    const {hourly} = data

    const hourLabels = ['midnight', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am',
        '7 am', '8 am', '9 am', '10 am', '11 am', 'noon', '1 pm', '2 pm', '3 pm',
        '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm']

    const hourlyRequests = Object.keys(hourly).map(key => {
        const hour = hourLabels[parseInt(key)]
        const count = Object.keys(hourly[key]).reduce((acc, source) => acc + hourly[key][source], 0)
        return {x: hour, y: count}
    }).sort((a, b) => hourLabels.indexOf(a.x) - hourLabels.indexOf(b.x))

    const lineData = [{id: 'Hourly Requests', data: hourlyRequests}]

    return (
        <div>
            <HourlyLine data={lineData}/>
        </div>

    )
}

export default FirebaseHourlyLine
