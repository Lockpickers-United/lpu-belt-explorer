import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import {useNavigate} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'

function RaffleHeader({page}) {
    const navigate = useNavigate()
    const {isMobile} = useWindowSize()

    const flexStyle = !isMobile ? 'flex' : 'block'
    const bottonTop = !isMobile ? 8 : 0

    return (
        <div style={{
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 20,
            padding: '14px 8px 0px 8px',
            fontWeight: 700,
            display: flexStyle
        }}>
            <div style={{flexGrow: 1, fontSize: '1.7rem', marginTop: 0}}>LPU Annual Raffle</div>
            <div style={{marginTop: bottonTop, justifyItems: 'right'}}>
                <div style={{flexGrow: 1}}/>
                <Tooltip title={'Raffle Prizes'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => navigate('/rafl')}
                            style={{marginRight: 10, color: page === 'pots' ? '#fff' : '#ccc'}}
                            disabled={page === 'pots'}>
                        PRIZES
                    </Button>
                    </span>
                </Tooltip>
                <Tooltip title={'Approved Charities'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => navigate('/rafl/charities')}
                            style={{marginRight: 10, color: page === 'charities' ? '#fff' : '#ccc'}}
                            disabled={page === 'charities'}>
                        CHARITIES
                    </Button>
                </span>
                </Tooltip>
                <Tooltip title={'About RAFL'} arrow disableFocusListener style={{}}>
                <span>
                    <Button onClick={() => navigate('/rafl/about')}
                            style={{marginRight: 0, color: page === 'about' ? '#fff' : '#ccc'}}
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


