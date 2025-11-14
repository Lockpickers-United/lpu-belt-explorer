import React, {useCallback, useContext, useEffect, useState} from 'react'
import Tracker from '../app/Tracker'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import RaffleHeader from './RaffleHeader.jsx'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import RaffleInfoIntro from './RaffleInfoIntro.md?raw'
import RaffleInfoDetails from './RaffleInfoDetails.md?raw'
import Button from '@mui/material/Button'
import RaffleSubHead from './RaffleSubHead.jsx'
import {useNavigate} from 'react-router-dom'
import AdminToolsButton from './AdminToolsButton.jsx'
import AuthContext from '../app/AuthContext.jsx'
import SignInButton from '../auth/SignInButton.jsx'
import Popover from '@mui/material/Popover'
import SignInDetect from '../auth/SignInDetect.jsx'
import RaffleContext from './RaffleContext.jsx'

function RaffleEnterAboutRoute() {
    usePageTitle('Enter the RAFL')
    const navigate = useNavigate()

    const {isLoggedIn} = useContext(AuthContext)
    const {raffleAdminRole, raflState} = useContext(RaffleContext)
    const disableEnterButton = raflState !== 'live' && !raffleAdminRole

    const [signInStarted, setSignInStarted] = useState(false)
    const [newSignIn, setNewSignIn] = useState(false)
    useEffect(() => {
        if (newSignIn) {
            setNewSignIn(false)
            signInStarted && navigate('/rafl/entryform')
        }
    }, [navigate, newSignIn, signInStarted])

    const [anchorEl, setAnchorEl] = useState(() => undefined)
    const menuOpen = Boolean(anchorEl)
    const handleMenuOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setSignInStarted(true)
        setAnchorEl(event.currentTarget)
    }, [])
    const handleMenuClose = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(null)
    }, [])

    const handleEnterClick = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        navigate('/rafl/entryform')
    }, [navigate])

    const popoverContent = (
        <div style={{width: '100%', padding: 20, justifyItems: 'center'}}>
            <div style={{textAlign: 'center', fontSize: '1.2rem', marginBottom: 15}}>
                <SignInButton linkText={'Please sign in to enter the Raffle.'}/>
            </div>
            <div style={{width: 204}}><SignInButton/></div>
        </div>
    )

    const {isMobile} = useWindowSize()
    const sideSpacing = !isMobile ? 0 : 8
    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: sideSpacing,
        paddingRight: sideSpacing
    }
    const contentPadding = !isMobile ? '0px 20px' : '0px 10px'
    const linebreak = !isMobile ? ' ' : <br/>

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
            <AdminToolsButton/>
        </React.Fragment>
    )

    return (
        <React.Fragment>

            <Nav title='Enter the RAFL' extras={extras}/>

            <div style={style}>
                <RaffleHeader page={'enter'}/>
                <RaffleSubHead text={'About the Raffle'}/>
            </div>


            <div style={{
                ...style,
                backgroundColor: '#222',
                minHeight: 72,
                alignItems: 'center',
                borderBottom: '1px #555 solid',
                padding: '20px 20px'
            }}>

                <div style={{padding: contentPadding}}>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                        {`${RaffleInfoIntro}`}
                    </ReactMarkdown>
                </div>

                {disableEnterButton
                    ? <div style={{...style, textAlign: 'center', paddingTop: 20, paddingBottom: 20}}>
                        <strong>RAFL isn&#39;t currently active.</strong><br/><br/>
                        <Button variant='contained' color='success' disabled={true}
                                onClick={handleEnterClick}>
                            Click here to enter the RAFL
                        </Button>
                    </div>

                    : <div style={{...style, textAlign: 'center', paddingTop: 20, paddingBottom: 20}}>
                        Once you&#39;ve read the rules and{linebreak}made your donation<br/><br/>

                        {isLoggedIn
                            ? <Button variant='contained' color='success'
                                      onClick={handleEnterClick}>
                                Click here to enter the RAFL
                            </Button>
                            : <React.Fragment><Button variant='contained' color='info'
                                                      onClick={handleMenuOpen}>
                                Click here to enter the RAFL
                            </Button>
                                <Popover open={menuOpen} anchorEl={anchorEl} onClose={handleMenuClose}
                                         anchorOrigin={{
                                             vertical: 'bottom',
                                             horizontal: 'left'
                                         }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        fontSize: '1.2rem',
                                        padding: 30,
                                        width: 300,
                                        placeItems: 'center'
                                    }}
                                         onClick={handleMenuClose}>
                                        {popoverContent}
                                    </div>
                                </Popover>
                            </React.Fragment>
                        }
                    </div>
                }
                <div style={style}>
                    <div style={{padding: contentPadding}}>
                        <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                            {`${RaffleInfoDetails}`}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            <div style={{height: 32}}/>

            <Footer/>
            <Tracker feature='raflEnterAbout'/>

            <SignInDetect newSignIn={newSignIn} setNewSignIn={setNewSignIn} required={false} dialog={false}/>


        </React.Fragment>
    )
}

export default RaffleEnterAboutRoute
