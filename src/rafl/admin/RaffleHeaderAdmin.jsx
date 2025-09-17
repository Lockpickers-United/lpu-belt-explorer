import React, {useCallback, useContext} from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import RaffleContext from '../RaffleContext.jsx'
import {useNavigate} from 'react-router-dom'

export default function RaffleHeaderAdmin({page}) {

    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const navigate = useNavigate()
    const {displayStats, setAnimateTotal} = useContext(RaffleContext)

    const handleChange = useCallback((page) => {
        navigate(page)
        setAnimateTotal(false)
    }, [navigate, setAnimateTotal])


    let prizeButtonText = raflState !== 'preview' || raffleAdminRole || isMobile ? 'PRIZES' : 'PRIZE PREVIEW'
    prizeButtonText = ['hidden', 'post'].includes(raflState) ? prizeButtonText.replace('PRIZES', '2025 PRIZES') : prizeButtonText

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

                    <Tooltip title={'Raffle Drawing'} arrow disableFocusListener style={{}}>
                        <span>
                            <Button onClick={() => handleChange('/rafl/admin/drawing')}
                                    style={{
                                        marginRight: 10,
                                        color: page === 'drawing' ? '#fff' : '#ccc',
                                        fontSize: buttonFontSize
                                    }}
                                    disabled={page === 'drawing'}>
                                DRAW WINNERS
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title={'Raffle Reports'} arrow disableFocusListener style={{}}>
                        <span>
                            <Button onClick={() => handleChange('/rafl/reports')}
                                    style={{
                                        marginRight: 10,
                                        color: page === 'reports' ? '#fff' : '#ccc',
                                        fontSize: buttonFontSize
                                    }}
                                    disabled={page === 'reports'}>
                                REPORTS
                            </Button>
                        </span>
                    </Tooltip>


                    <Tooltip title={'Raffle Entries'} arrow disableFocusListener style={{}}>
                        <span>
                            <Button onClick={() => handleChange('/rafl/admin')}
                                    style={{
                                        marginRight: 10,
                                        color: page === 'entries' ? '#fff' : '#ccc',
                                        fontSize: buttonFontSize
                                    }}
                                    disabled={page === 'entries'}>
                                ENTRIES
                            </Button>
                        </span>
                    </Tooltip>

                </div>
            </div>
            <div style={{height: 8}}/>
        </React.Fragment>
    )

}



