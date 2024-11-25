import React, {useCallback, useContext} from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import {useNavigate} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'
import {Collapse} from '@mui/material'
import CountUp from 'react-countup'
import RaffleStatsContext from './RaffleStatsContext.jsx'

function RaffleHeader({page}) {
    const navigate = useNavigate()
    const {summaryStats, displayStats, toggleStats, animateTotal, setAnimateTotal} = useContext(RaffleStatsContext)

    const donors = summaryStats && summaryStats[0].donors
    const donationsTotal = summaryStats && summaryStats[0].donationsTotal
    const donationsTotalStr = summaryStats && new Intl.NumberFormat().format(summaryStats[0].donationsTotal)
    const averageDonation = summaryStats && Math.floor(summaryStats[0].donationsTotal / donors)
    //const donationsTotal2024 = data && new Intl.NumberFormat().format(data[0].donationsTotal2024)

    const chartWidth = 300
    const discordWidth = summaryStats && (summaryStats[0].donationsDiscord / (summaryStats[0].donationsDiscord + summaryStats[0].donationsReddit)) * chartWidth
    const redditWidth = summaryStats && (summaryStats[0].donationsReddit / (summaryStats[0].donationsDiscord + summaryStats[0].donationsReddit)) * chartWidth

    const toggleOpen = useCallback(() => {
        toggleStats()
    }, [toggleStats])

    const handleChange = useCallback((page) => {
        navigate(page)
        setAnimateTotal(false)
    }, [navigate, setAnimateTotal])

    const {isMobile} = useWindowSize()
    const flexStyle = !isMobile ? 'flex' : 'block'
    const buttonTop = !isMobile ? 4 : 0
    const buttonFontSize = !isMobile ? '1.03rem' : '1.0rem'

    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        padding: '14px 8px 0px 8px',
        fontWeight: 700,
        display: flexStyle
    }

    const discordStyle = {border: '1px solid #ccc', borderTopLeftRadius: 10, borderBottomLeftRadius: 10}
    const redditStyle = {border: '1px solid #ccc', borderTopRightRadius: 10, borderBottomRightRadius: 10}


    return (
        <React.Fragment>
            <div style={style}>
                <div style={{flexGrow: 1, fontSize: '1.7rem', marginTop: 0}}>LPU Annual Raffle</div>
                <div style={{marginTop: buttonTop, justifyItems: 'right'}}>
                    <div style={{flexGrow: 1}}/>
                    <Tooltip title={'Raffle Prizes'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => handleChange('/rafl')}
                            style={{
                                marginRight: 10,
                                color: page === 'pots' ? '#fff' : '#ccc',
                                fontSize: buttonFontSize
                            }}
                            disabled={page === 'pots'}>
                        PRIZES
                    </Button>
                    </span>
                    </Tooltip>
                    <Tooltip title={'Approved Charities'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => handleChange('/rafl/charities')}
                            style={{
                                marginRight: 10,
                                color: page === 'charities' ? '#fff' : '#ccc',
                                fontSize: buttonFontSize
                            }}
                            disabled={page === 'charities'}>
                        CHARITIES
                    </Button>
                </span>
                    </Tooltip>
                    <Tooltip title={'Real-time Stats'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={toggleOpen}
                            style={{
                                marginRight: 10,
                                color: displayStats ? '#96ace5' : '#ccc',
                                fontSize: buttonFontSize
                            }}>
                        STATS
                    </Button>
                </span>
                    </Tooltip>
                    <Tooltip title={'Enter the RAFL'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => navigate('/rafl/about')}
                            style={{
                                marginRight: 0,
                                color: page === 'about' ? '#fff' : '#ccc',
                                fontSize: buttonFontSize
                            }}
                            disabled={true}>
                        ENTER
                    </Button>
                </span>
                    </Tooltip>
                </div>
            </div>
            {displayStats &&
                <Collapse in={displayStats} style={{padding: '0px 12px'}}>
                    <div style={{
                        ...style,
                        borderTop: '1px solid #aaa',
                        borderBottom: '1px solid #aaa',
                        marginBottom: 20,
                        padding: '14px 20px 12px 20px'
                    }}>
                        <div style={{flexGrow: 1, marginTop: 0, marginBottom:8}}>
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
                        <div style={{width: chartWidth, display: 'block', textAlign: 'center', marginTop: 2}}>
                            {!isMobile && <span style={{fontWeight: 400}}>Source</span> }
                            <div style={{display: 'flex', textAlign: 'left'}}>
                                <div style={{flexGrow: 1, paddingLeft: 8}}>Discord</div>
                                <div style={{paddingRight: 8}}>Reddit</div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div style={{
                                    ...discordStyle,
                                    width: discordWidth,
                                    backgroundColor: '#2d52b0',
                                    height: 20
                                }}></div>
                                <div style={{
                                    ...redditStyle,
                                    width: redditWidth,
                                    backgroundColor: '#587ee6',
                                    height: 20
                                }}></div>
                            </div>
                        </div>
                    </div>
                </Collapse>
            }
        </React.Fragment>
    )

}

export default RaffleHeader


