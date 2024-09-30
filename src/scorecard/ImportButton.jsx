import React, {useCallback, useContext, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'

import Backdrop from '@mui/material/Backdrop'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Button from '@mui/material/Button'
import ImportDanSheetForm from './ImportDanSheetForm.jsx'
import DBContext from '../app/DBContext.jsx'

function ImportButton() {
    const {oauthState} = useContext(DBContext)

    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
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
        const newState = await oauthState()
        const scope = encodeURIComponent('identity flair privatemessages')
        const redirectUri = encodeURIComponent(`${location.origin}/#/auth/reddit`)

        const url = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${newState}&redirect_uri=${redirectUri}&duration=temporary&scope=${scope}`
        window.location.assign(url)
    }, [oauthState])

    return (
        <React.Fragment>
            <Tooltip title='My Collection' arrow disableFocusListener>
                <Button
                    variant='contained'
                    color='secondary' size='small'
                    style={{lineHeight: '1.2rem', marginLeft: 6}}
                    onClick={handleOpen}
                >
                    IMPORT
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
                        <CardHeader title={'Import'}
                                    action={<HighlightOffIcon sx={{cursor: 'pointer'}}/>}
                                    style={{paddingBottom: 0}}
                                    onClick={handleClose}/>
                        <CardContent>
                            <div style={{padding: 20}}>
                                New! Add your Belt (and Dan Level) approvals to your Scorecard.
                                You&#39;ll need to authorize for each site, and we&#39;ll pull your username and
                                approvals for you. Please note: you can only import belts already approved through the official process.
                                <i>Click here for info</i>.
                            </div>
                            <div style={{padding: 20, width: '100%', textAlign: 'center'}}>
                                Import From<br/>

                                <div style={{marginTop:8}}>
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

                            <ImportDanSheetForm/>
                        </CardContent>
                    </Card>
                }
            </Backdrop>

        </React.Fragment>
    )
}

export default ImportButton
