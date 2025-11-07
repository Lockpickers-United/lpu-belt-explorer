import React, {useCallback, useContext} from 'react'
import Button from '@mui/material/Button'
import {useNavigate} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'
import RaffleHeaderAdmin from './admin/RaffleHeaderAdmin.jsx'

function RaffleHeader({page, width = 700}) {
    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const navigate = useNavigate()
    const {setAnimateTotal} = useContext(RaffleContext)

    const handleChange = useCallback((page) => {
        navigate(page)
        setAnimateTotal(false)
    }, [navigate, setAnimateTotal])

    const {isMobile, flexStyle} = useWindowSize()
    const buttonTop = !isMobile ? 4 : 0
    const buttonFontSize = !isMobile ? '1.03rem' : '1.0rem'

    const style = {
        maxWidth: width,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        padding: '0px 0px 0px 0px',
        fontWeight: 700,
        display: flexStyle
    }

    let prizeButtonText = raflState !== 'preview' || raffleAdminRole || isMobile ? 'PRIZES' : 'PRIZE PREVIEW'
    prizeButtonText = ['hidden', 'post'].includes(raflState) ? prizeButtonText.replace('PRIZES', '2025 PRIZES') : prizeButtonText

    return (
        <React.Fragment>
            <div style={style}>
                <div style={{flexGrow: 1, fontSize: '1.7rem', marginTop: 0}}>LPU Annual Raffle</div>
                <div style={{marginTop: buttonTop, justifyItems: 'right'}}>
                    <div style={{flexGrow: 1}}/>

                    <Button onClick={() => handleChange('/rafl')}
                            style={{
                                marginRight: 10,
                                color: page === 'pots' ? '#fff' : '#ccc',
                                fontSize: buttonFontSize
                            }}
                            disabled={page === 'pots'}>
                        {prizeButtonText}
                    </Button>

                    {(raflState === 'preview' && !raffleAdminRole) &&
                        <Button onClick={() => handleChange('/rafl/announce')}
                                style={{
                                    marginRight: 10,
                                    color: page === 'announce' ? '#fff' : '#ccc',
                                    fontSize: buttonFontSize
                                }}
                                disabled={page === 'announce'}>
                            CONTRIBUTE
                        </Button>
                    }

                    {(raflState !== 'hidden' || raffleAdminRole) &&
                        <Button onClick={() => handleChange('/rafl/charities')}
                                style={{
                                    marginRight: 10,
                                    color: page === 'charities' ? '#fff' : '#ccc',
                                    fontSize: buttonFontSize
                                }}
                                disabled={page === 'charities'}>
                            CHARITIES
                        </Button>
                    }

                    {(['live', 'post'].includes(raflState) || raffleAdminRole) &&
                        <Button onClick={() => handleChange('/rafl/enter')}
                                style={{
                                    marginRight: 10,
                                    color: page === 'enter' ? '#fff' : '#ccc',
                                    fontSize: buttonFontSize
                                }}>
                            ENTER
                        </Button>
                    }

                    {(['live', 'post'].includes(raflState) || raffleAdminRole) &&
                        <Button onClick={() => handleChange('/rafl/stats')}
                                style={{
                                    marginRight: 0,
                                    color: page === 'stats' ? '#fff' : '#ccc',
                                    fontSize: buttonFontSize
                                }}>
                            STATS
                        </Button>
                    }

                </div>
            </div>
            {raffleAdminRole &&
                <RaffleHeaderAdmin page={page} width={width}/>
            }
            <div style={{height: 8}}/>
        </React.Fragment>
    )

}

export default RaffleHeader


