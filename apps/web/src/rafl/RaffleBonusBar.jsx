import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'
import dayjs from 'dayjs'
import raflBonusData from '../data/raflBonuses.json'
import RaffleContext from './RaffleContext.jsx'
import {useCountdown} from '../util/useCountdown.jsx'

export default function RaffleBonusBar() {
    const navigate = useNavigate()
    const {isMobile} = useWindowSize()
    const {summary} = useContext(RaffleContext)
    const donationsTotal = summary.totalDonations || 0

    const handleClick = () => navigate('/rafl/enter')

    const activeBonuses = raflBonusData?.filter(bonus =>
        dayjs(bonus.endDate).isAfter(dayjs()) && dayjs(bonus.startDate).isBefore(dayjs()))
        .sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate)) || a.target - b.target)

    if (!activeBonuses.length) return null

    const unmetBonuses = activeBonuses.filter(bonus => bonus.target > donationsTotal)
    const bonus = unmetBonuses.length ? unmetBonuses[0] : activeBonuses[0] ?? {}

    const {
        remaining,
        formattedTime
    } = useCountdown({endTime: bonus?.endDate ? dayjs(bonus.endDate).valueOf() : undefined})

    const remainingDonations = bonus?.target - donationsTotal
    const remainingDonationsString = '$' + new Intl.NumberFormat().format(remainingDonations)
    const targetString = '$' + new Intl.NumberFormat().format(bonus.target)
    const donationsTotalString = '$' + new Intl.NumberFormat().format(donationsTotal)

    const endsSoon = remaining < 1000 * 60 * 60
    const timeStyle = endsSoon ? {color: '#f54040'} : {}

    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8, fontSize: '0.9rem'}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12, fontSize: '1.0rem'}

    return (
        <div style={{...style, backgroundColor: '#333', minHeight: 72, marginBottom: 6}}>
            <div style={{padding: '4px 4px 10px 4px'}}>
                <div style={{fontSize: '1.1rem', fontWeight: 500, marginTop: 1, marginBottom: 4}}>
                    <span style={{color: '#9173fa'}}>Bonus:</span> {bonus.title}
                </div>
                {bonus.description.replace('[TARGET]', targetString)}
                &nbsp;
                {remainingDonations < 0 && <Link onClick={handleClick}>Enter Now!</Link>}

                {remainingDonations > 0
                    ? <div style={{
                        fontSize: '1.0rem',
                        textAlign: 'right',
                        fontWeight: 500,
                        marginTop: 6,
                        marginBottom: 0
                    }}>
                        <span style={{color: '#9173fa'}}>Remaining:</span> {remainingDonationsString} / <span
                        style={timeStyle}>{formattedTime}</span>
                    </div>
                    : <div style={{
                        fontSize: '1.1rem',
                        textAlign: 'right',
                        fontWeight: 500,
                        marginTop: 6,
                        marginBottom: 0
                    }}>
                        <span style={{color: '#9173fa'}}>We did it!</span> <span style={{whiteSpace: 'nowrap'}}>Current donations: {donationsTotalString}</span>
                    </div>
                }
            </div>
        </div>
    )

}