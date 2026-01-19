import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import RaffleContext from './RaffleContext.jsx'
import {useNavigate} from 'react-router-dom'
import Link from '@mui/material/Link'

export default function RaffleIntroBar() {
    const {raflState} = useContext(RaffleContext)
    const navigate = useNavigate()
    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12}

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    // TODO: Make a new state for drawing?

    const preDrawing = false
    
    return (
        <React.Fragment>
            {(raflState === 'preview') &&
                <div style={{...style, backgroundColor: '#333', minHeight: 72}}>
                    <div style={{padding: '4px 4px 10px 4px'}}>
                        <div style={{fontSize: '1.2rem', fontWeight: 500, marginTop: 1, marginBottom: 7}}>
                            RAFL is coming soon!
                        </div>
                        We will start accepting entries on Monday, January 19th. In the meantime,
                        here&#39;s a preview of the pots that folks are developing.
                        Please note that <strong>all pots and contents are subject to change</strong> until
                        the raffle begins in January.
                    </div>
                </div>
            }

            {(raflState === 'setup') &&
                <div style={{...style, backgroundColor: '#333', minHeight: 72}}>
                    <div style={{padding: '4px 4px 10px 4px'}}>
                        <div style={{fontSize: '1.2rem', fontWeight: 500, marginTop: 1, marginBottom: 7}}>
                            RAFL is coming soon!
                        </div>
                        We will start accepting entries on Monday, January 19th. See you then!
                    </div>
                </div>
            }

            {(raflState === 'live') &&
                <div style={{...style, backgroundColor: '#333', minHeight: 72}}>
                    <div style={{padding: '4px 4px 10px 4px'}}>
                        <div style={{fontSize: '1.2rem', fontWeight: 700, marginTop: 1, marginBottom: 7}}>
                            RAFL is on!
                        </div>
                        <div style={{fontSize: '1rem', marginTop: 1, marginBottom: 15}}>
                            Welcome to the <strong>2026 Lockpicking Charity Raffle</strong>.
                            You donate to your favorite charity and every dollar donated
                            earns a ticket you can put towards any of the fantastic pots
                            the community has donated this year.
                            To read the full details
                            (and enter to win) <Link onClick={() => navigate('/rafl/enter')}
                                                     style={{
                                                         color: '#fff',
                                                         textDecorationColor: '#fff',
                                                         fontWeight: 700,
                                                         cursor: 'pointer'
                                                     }}>
                            click here.
                        </Link>
                        </div>
                        <div style={{fontSize: '1rem', fontWeight: 700}}>
                            Entries will be accepted through February 14th,
                            and the primary prize drawing will happen via livestream at 11 a.m. PDT
                            on Monday, February 16th.
                        </div>
                    </div>
                </div>
            }

            {(raflState === 'post' && preDrawing) &&
                <div style={{...style, backgroundColor: '#333', minHeight: 72}}>
                    <div style={{padding: '4px 4px 10px 4px'}}>
                        <div style={{fontSize: '1.2rem', fontWeight: 500, marginTop: 1, marginBottom: 7}}>
                            Entries for RAFL 2026 are no longer being accepted.
                        </div>
                        Tune in to the livestream at 11am US Pacific Time (PDT) on Sunday, February 15th to see if you won:&nbsp;
                        <Link onClick={() => openInNewTab('https://www.youtube.com/live/5ZCMkFkv_Rc')} style={{
                            color: '#ffffff',
                            fontWeight: 600
                        }}>https://www.youtube.com/live/5ZCMkFkv_Rc</Link>
                        <br/><br/>
                        The winners will be posted here soon.
                    </div>
                </div>
            }

            {(raflState === 'post' && !preDrawing) &&
                <div style={{...style, backgroundColor: '#333', minHeight: 72}}>
                    <div style={{padding: '4px 4px 10px 4px'}}>
                        <div style={{fontSize: '1.2rem', fontWeight: 500, marginTop: 1, marginBottom: 7}}>
                            RAFL 2026 has ended.
                        </div>
                        Check out the winners below, see you next year!
                    </div>
                </div>
            }
        </React.Fragment>
    )

}