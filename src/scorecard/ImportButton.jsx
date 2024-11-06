import React, {useCallback, useContext, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'

import Backdrop from '@mui/material/Backdrop'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Button from '@mui/material/Button'
import ImportDanSheetForm from './ImportDanSheetForm.jsx'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import {Collapse} from '@mui/material'

function ImportButton({profile}) {
    const {isMobile} = useWindowSize()
    const {user} = useContext(AuthContext)
    const {oauthState} = useContext(DBContext)
    const danSheetImported = profile?.blackBeltAwardedAt > 0

    const [danImportOpen, setDanImportOpen] = useState(false)

    const toggleDanImport = useCallback(() => {
        setDanImportOpen(!danImportOpen)
    }, [danImportOpen])


    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
        setDanImportOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    const handleDiscordAuth = useCallback(() => {
        const {VITE_DISCORD_CLIENT_ID: clientId} = import.meta.env
        const scope = encodeURIComponent('identify')
        const redirectUri = encodeURIComponent(`${location.origin}/#/auth/discord`)

        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`
        window.location.assign(url)
    }, [])

    const handleRedditAuth = useCallback(async () => {
        const {VITE_REDDIT_CLIENT_ID: clientId} = import.meta.env
        const newState = await oauthState(user.uid)
        const scope = encodeURIComponent('identity flair privatemessages')
        const redirectUri = encodeURIComponent(`${location.origin}/#/auth/reddit`)

        const url = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${newState}&redirect_uri=${redirectUri}&duration=temporary&scope=${scope}`
        window.location.assign(url)
    }, [user, oauthState])

    const fontSize = isMobile ? '0.91rem' : '1rem'
    const lineHeight = isMobile ? '1.3rem' : '1.5rem'

    const buttonText = 'IMPORT BELTS'

    return (
        <React.Fragment>
            <Tooltip title='Import' arrow disableFocusListener>
                <Button
                    variant='contained'
                    color='secondary' size='small'
                    style={{lineHeight: '1.2rem', marginLeft: 6}}
                    onClick={handleOpen}
                >
                    {buttonText}
                </Button>
            </Tooltip>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open} onClick={null}
            >
                {open &&
                    <Card style={{
                        maxWidth: 600,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        border: '1px solid #666',
                        opacity: 1
                    }}>
                        <CardHeader title={'Import Belts'}
                                    action={<HighlightOffIcon sx={{cursor: 'pointer'}}/>}
                                    style={{paddingBottom: 0}}
                                    onClick={handleClose}/>
                        <CardContent>
                            <Collapse in={!danImportOpen}>

                                <div style={{padding: '0px 0px', fontSize: fontSize, lineHeight: lineHeight}}>
                                    <strong>New!</strong> Add your approved Belts (and Dan Levels) to your Scorecard.
                                    You&#39;ll need to authorize for each site, and we&#39;ll pull your username and
                                    approvals for you. Please note: you can only import belts already approved through
                                    the official process.
                                    <br/><br/>

                                    You&#39;ll need to briefly authorize for each platform you use for belts (Discord
                                    and/or Reddit) to verify your username. For Discord, we get the belt approvals from
                                    the #belt-requests channel. For Reddit, we need to read your messages to find the
                                    Mod approvals. We only make a connection once per import and your accounts will not
                                    remained linked. We cannot access and do not store your password.

                                    <br/><br/>
                                    <span style={{fontWeight: 400}}>
                                    New Discord approvals will be automatically added to your scorecard
                                    as long as there is a Discord username in your Profile.
                                    You only need to re-import from Discord if you want to
                                    add belts from an additional username.<br/><br/>

                                    You&#39;ll need to import from Reddit again to pick up newly approved belts.

                                </span>

                                </div>

                                <div style={{padding: 20, width: '100%', textAlign: 'center'}}>
                                    <span style={{fontWeight: 700}}>Import From</span><br/>

                                    <div style={{marginTop: 8}}>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            style={{lineHeight: '1.2rem'}}
                                            onClick={handleDiscordAuth}
                                        >DISCORD</Button>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            style={{lineHeight: '1.2rem', marginLeft: 16}}
                                            onClick={handleRedditAuth}
                                        >REDDIT</Button>
                                    </div>
                                </div>

                                {!danSheetImported &&
                                    <div style={{padding: 20, width: '100%', textAlign: 'center'}}>
                                        Black Belts only: <Link onClick={toggleDanImport}
                                                                style={{color: '#99c2e5', cursor: 'pointer'}}>
                                        Import your Dan Sheet
                                    </Link>
                                    </div>
                                }
                            </Collapse>

                            <Collapse in={danImportOpen}>
                                {danImportOpen &&
                                    <React.Fragment>

                                        <ImportDanSheetForm/>

                                        <div style={{padding: 20, width: '100%', textAlign: 'center'}}>
                                            Return to <Link onClick={toggleDanImport}
                                                            style={{color: '#99c2e5', cursor: 'pointer'}}>
                                            Import Belts
                                        </Link>
                                        </div>
                                    </React.Fragment>
                                }
                            </Collapse>
                        </CardContent>
                    </Card>
                }
            </Backdrop>

        </React.Fragment>
    )
}

export default ImportButton
