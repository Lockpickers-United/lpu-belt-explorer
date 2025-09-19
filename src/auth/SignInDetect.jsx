import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'
import dayjs from 'dayjs'
import SignInButton from './SignInButton.jsx'
import ScopedDialog from '../misc/ScopedDialog.jsx'

export default function SignInDetect({
                                         newSignIn = false,
                                         setNewSignIn = (_) => {}, //eslint-disable-line
                                         dialog,
                                         required,
                                         linkText = 'You must be signed in to use this page.',
                                         containerRef = null
                                     }) {
    /*
      Take an action when new sign in detacted:
        <SignInDetect newSignIn={newSignIn} setNewSignIn={setNewSignIn} required={false} dialog={false} />
      Display sign in dialog if user not signed in:
        <SignInDetect required={true} dialog={false} linkText={'You must be signed in to enter the Raffle.'}/>
      Snackbar displayed unless dialog=true
    */

    const {authLoaded, isLoggedIn, user, initialUser, setInitialUser} = useContext(AuthContext)
    const {getProfile} = useContext(DBContext)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [displayName, setDisplayName] = useState(undefined)
    const handleDisplayName = useCallback(async () => {
        const profile = user?.uid ? await getProfile(user?.uid) : null
        if (profile?.displayName) setDisplayName(profile.displayName)
    }, [getProfile, user])

    useEffect(() => {
        handleDisplayName().then()
    }, [handleDisplayName])

    const handleSignIn = useCallback(() => {
        setInitialUser('yes')
        const isBack = dayjs(user.metadata.creationTime).isBefore(dayjs(), 'hour') ? ' back' : ''
        dialog
            ? setDialogOpen(true)
            : enqueueSnackbar(displayName ? `Welcome back ${displayName}!` : `Welcome${isBack}!`, {variant: 'success'})
    }, [dialog, displayName, setInitialUser, user])

    const prevLoggedInRef = useRef(false)
    useEffect(() => {
        if (!authLoaded) return
        // Detect transition: not logged in -> logged in
        if (isLoggedIn && !prevLoggedInRef.current && Object.keys(user || {}).length > 0) {
            if (initialUser === 'no' && Object.keys(user || {}).length > 0) {
                setNewSignIn(true)
                handleSignIn()
            }
        }
        prevLoggedInRef.current = isLoggedIn
    }, [authLoaded, isLoggedIn, initialUser, user, handleSignIn, newSignIn, setNewSignIn])

    const handleDialogClose = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        setNewSignIn(false)
        setInitialUser('yes')
        setDialogOpen(false)
    }, [setInitialUser, setNewSignIn])

    const welcomeDialogContent = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: 30,
            placeItems: 'center',
            margin: '40px 0px'
        }} onClick={handleDialogClose}>
            <div style={{textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, marginBottom: 25}}>
                Welcome{displayName ? ' back ' + displayName : ''}!<br/>
            </div>
            <Button variant='outlined' style={{width: 100}} onClick={handleDialogClose}>Close</Button>
        </div>
    )

    const [showSignInDialog, setShowSignInDialog] = useState(false)
    useEffect(() => {
        if (required && authLoaded && !isLoggedIn) {
            setShowSignInDialog(true)
        } else {
            setShowSignInDialog(false)
        }
    }, [authLoaded, isLoggedIn, required])

    const mustSignInDialogContent = (
        <div style={{width: '100%', padding: '50px 10px', justifyItems: 'center'}}>
            <div style={{textAlign: 'center', fontSize: '1.2rem', marginBottom: 15, width: 250}}>
                <SignInButton linkText={linkText}/>
            </div>
            <div style={{width: 204}}>
                <SignInButton/>
            </div>
        </div>
    )

    return (
        <React.Fragment>

            <ScopedDialog
                open={dialog && dialogOpen}
                dialogContent={welcomeDialogContent}
                handleClose={handleDialogClose}
                containerRef={containerRef}
                width={400}
                position={{top: 80}}
                centerX={true}
            />

            <ScopedDialog
                open={showSignInDialog}
                dialogContent={mustSignInDialogContent}
                handleClose={undefined}
                containerRef={containerRef}
                position={{top: 80}}
                centerX={true}
                dark={true}
            />

        </React.Fragment>
    )


}