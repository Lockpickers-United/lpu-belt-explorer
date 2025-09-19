import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import Button from '@mui/material/Button'
import DisplayDialog from '../misc/DisplayDialog.jsx'
import {enqueueSnackbar} from 'notistack'
import dayjs from 'dayjs'
import SignInButton from './SignInButton.jsx'

export default function SignInDetect({newSignIn, setNewSignIn, dialog, required}) {

    const {authLoaded, isLoggedIn, user, initialUser, setInitialUser} = useContext(AuthContext)
    const {getProfile} = useContext(DBContext)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [displayName, setDisplayName] = useState(undefined)
    const handleDisplayName = useCallback(async () => {
        const profile = user?.uid ? await getProfile(user?.uid) : null
        if (profile?.displayName) setDisplayName(profile.displayName)
    }, [getProfile, user?.uid])

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
            console.log('NEW LOGIN DETECTED', {newSignIn, authLoaded, isLoggedIn, user, initialUser})
            if (initialUser === 'no' && user) {
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
    const handleSignInDialogClose = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        setShowSignInDialog(false)
    }, [])
    useEffect(() => {
        if (required && authLoaded && !isLoggedIn) {
            setShowSignInDialog(true)
        } else {
            setShowSignInDialog(false)
        }
    }, [authLoaded, isLoggedIn, required])
    const mustSignInDialogContent = (
        <div style={{width: '100%', padding: 20, justifyItems: 'center'}}>
            <div style={{textAlign: 'center', fontSize: '1.2rem', marginBottom: 15}}>
                <SignInButton linkText={'You must be signed in to use this page.'}/>
            </div>
            <div style={{width: 204}}><SignInButton/></div>
        </div>
    )

    return (
        <React.Fragment>
            <DisplayDialog dialogContent={welcomeDialogContent} open={dialog && dialogOpen}
                           handleClose={handleDialogClose} title={'Welcome!'}
                           width={400}/>

            <DisplayDialog dialogContent={mustSignInDialogContent} open={showSignInDialog}
                           handleClose={handleSignInDialogClose} width={400}/>
        </React.Fragment>
    )


}