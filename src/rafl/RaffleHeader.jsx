import React, {useCallback, useContext} from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import {useNavigate} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'

function RaffleHeader({page}) {
    const {live, raffleAdminRole} = useContext(RaffleContext)
    const navigate = useNavigate()
    const {displayStats, setAnimateTotal} = useContext(RaffleContext)

    const handleChange = useCallback((page) => {
        navigate(page)
        setAnimateTotal(false)
    }, [navigate, setAnimateTotal])

    const {isMobile, flexStyle} = useWindowSize()
    const buttonTop = !isMobile ? 4 : 0
    const buttonFontSize = !isMobile ? '1.03rem' : '1.0rem'

    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        padding: '14px 0px 0px 0px',
        fontWeight: 700,
        display: flexStyle
    }

    const prizeButtonText = live || raffleAdminRole || isMobile ? 'PRIZES' : 'PRIZE PREVIEW'
    const toolTip = displayStats ? 'Hide Real-time Stats' : 'Show Real-time Stats'

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
                                {prizeButtonText}
                            </Button>
                        </span>
                    </Tooltip>

                    {(!live && !raffleAdminRole) &&
                        <Tooltip title={'Call For Contributions'} arrow disableFocusListener style={{}}>
                        <span>
                            <Button onClick={() => handleChange('/rafl/announce')}
                                    style={{
                                        marginRight: 10,
                                        color: page === 'announce' ? '#fff' : '#ccc',
                                        fontSize: buttonFontSize
                                    }}
                                    disabled={page === 'announce'}>
                                CONTRIBUTE
                            </Button>
                        </span>
                        </Tooltip>
                    }

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

                    {(live || raffleAdminRole) &&
                        <Tooltip title={'Enter the RAFL'} arrow disableFocusListener style={{}}>
                        <span>
                            <Button onClick={() => handleChange('/rafl/enter')}
                                    style={{
                                        marginRight: 10,
                                        color: page === 'enter' ? '#fff' : '#ccc',
                                        fontSize: buttonFontSize
                                    }}>
                                ENTER
                            </Button>
                        </span>
                        </Tooltip>
                    }

                    {(live || raffleAdminRole) &&
                        <Tooltip title={toolTip} arrow disableFocusListener style={{}}>
                        <span>
                            <Button onClick={() => handleChange('/rafl/stats')}
                                    style={{
                                        marginRight: 0,
                                        color: page === 'stats' ? '#fff' : '#ccc',
                                        fontSize: buttonFontSize
                                    }}>
                                STATS
                            </Button>
                        </span>
                        </Tooltip>
                    }

                </div>
            </div>
            <div style={{height: 8}}/>
        </React.Fragment>
    )

}

export default RaffleHeader


