import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import CountUp from 'react-countup'
import RaffleContext from './RaffleContext.jsx'

/**
 * @property raflSummaryStats.uniqueDonors
 * @property raflSummaryStats.totalDonors
 * @property raflSummaryStats.totalDonations
 * @property raflSummaryStats.platformDonations
 * @property raflSummaryStats.platformDonations.Discord
 * @property raflSummaryStats.platformDonations.Reddit
 */

function RaffleStatsHeader() {
    const {raflSummaryStats, animateTotal} = useContext(RaffleContext)

    const donors = raflSummaryStats && raflSummaryStats.uniqueDonors || 0
    const donationsTotal = raflSummaryStats && raflSummaryStats.totalDonations || 0
    const donationsTotalStr = raflSummaryStats && new Intl.NumberFormat().format(donationsTotal)
    const averageDonation = raflSummaryStats && Math.floor(donationsTotal / donors) || 0

    const chartWidth = 300
    const discordDonations = raflSummaryStats && raflSummaryStats.platformDonations?.Discord || 0
    const redditDonations = raflSummaryStats && raflSummaryStats.platformDonations?.Reddit || 0
    const totalDonations = raflSummaryStats && discordDonations + redditDonations
    const discordWidth = raflSummaryStats && (discordDonations / totalDonations) * chartWidth
    const redditWidth = raflSummaryStats && (redditDonations / totalDonations) * chartWidth


    const {isMobile, flexStyle} = useWindowSize()
    const statsPadding = !isMobile ? '14px 20px 12px 20px' : '10px 10px 16px 10px'
    const statsAlign = !isMobile ? 'left' : 'center'

    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        padding: '14px 0px 0px 0px',
        fontWeight: 700,
        display: flexStyle
    }

    const discordStyle = {border: '1px solid #ccc', borderTopLeftRadius: 10, borderBottomLeftRadius: 10}
    const redditStyle = {border: '1px solid #ccc', borderTopRightRadius: 10, borderBottomRightRadius: 10}

    return (
        <React.Fragment>
            <div style={{
                ...style,
                border: '1px solid #aaa',
                borderRadius: 8,
                marginBottom: 20,
                padding: statsPadding,
                textAlign: statsAlign,
                justifyItems: 'center'
            }}>
                <div style={{flexGrow: 1, marginTop: 0, marginBottom: 8}}>
                    <div style={{marginBottom: 5}}>
                        Total Donations &nbsp; {
                        donationsTotal > 1000 && animateTotal
                            ? <span style={{fontSize: '1.8rem'}}>$<CountUp end={donationsTotal} duration={1.5}/></span>
                            : <span style={{fontSize: '1.8rem'}}>${donationsTotalStr}</span>
                    }
                    </div>
                    <div><span
                        style={{fontWeight: 400, color: '#ddd'}}>Donors</span> {donors} &nbsp;&nbsp;&nbsp;
                        <span
                            style={{fontWeight: 400, color: '#ddd'}}>Average Donation</span> ${averageDonation}
                    </div>
                </div>
                <div style={{width: chartWidth, textAlign: 'center', marginTop: 2}}>
                    {!isMobile && <span style={{fontWeight: 700, fontSize:'1.1rem'}}>Source</span>}
                    <div style={{display: 'flex', textAlign: 'left', fontSize:'0.95rem'}}>
                        <div style={{flexGrow: 1, paddingLeft: 8}}>Discord</div>
                        <div style={{paddingRight: 8}}>Reddit</div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{
                            ...discordStyle,
                            width: discordWidth || 0,
                            backgroundColor: '#587ee6',
                            height: 20
                        }}></div>
                        <div style={{
                            ...redditStyle,
                            width: redditWidth || 0,
                            backgroundColor: '#2d52b0',
                            height: 20
                        }}></div>
                    </div>
                </div>
            </div>

            <div style={{height: 8}}/>
        </React.Fragment>
    )

}

export default RaffleStatsHeader


