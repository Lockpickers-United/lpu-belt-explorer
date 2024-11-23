import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import {useNavigate} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'

function RaffleHeader({page}) {
    const navigate = useNavigate()
    const {isMobile} = useWindowSize()

    const flexStyle = !isMobile ? 'flex' : 'block'
    const buttonTop = !isMobile ? 4 : 0
    const buttonFontSize = !isMobile ? '1.05rem' : '1.0rem'

    return (
        <div style={{
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 10,
            padding: '14px 8px 0px 8px',
            fontWeight: 700,
            display: flexStyle
        }}>
            <div style={{flexGrow: 1, fontSize: '1.7rem', marginTop: 0}}>LPU Annual Raffle</div>
            <div style={{marginTop: buttonTop, justifyItems: 'right'}}>
                <div style={{flexGrow: 1}}/>
                <Tooltip title={'Raffle Prizes'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => navigate('/rafl')}
                            style={{marginRight: 10, color: page === 'pots' ? '#fff' : '#ccc', fontSize: buttonFontSize}}
                            disabled={page === 'pots'}>
                        PRIZES
                    </Button>
                    </span>
                </Tooltip>
                <Tooltip title={'Approved Charities'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => navigate('/rafl/charities')}
                            style={{marginRight: 10, color: page === 'charities' ? '#fff' : '#ccc', fontSize: buttonFontSize}}
                            disabled={page === 'charities'}>
                        CHARITIES
                    </Button>
                </span>
                </Tooltip>
                <Tooltip title={'About RAFL'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => navigate('/rafl/about')}
                            style={{marginRight: 0, color: page === 'about' ? '#fff' : '#ccc', fontSize: buttonFontSize}}
                            disabled={true}>
                        ABOUT
                    </Button>
                </span>
                </Tooltip>
            </div>
        </div>
    )

}

export default RaffleHeader


