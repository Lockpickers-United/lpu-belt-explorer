import React, {useContext, useRef} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext.jsx'
import {useAccess} from '../app/AccessContext.jsx'
import LoadingDisplayNav from '../nav/LoadingDisplayNav'
import SignInDetect from '../auth/SignInDetect.jsx'
import Box from '@mui/material/Box'
import ScopedDialog from './ScopedDialog.jsx'
import Button from '@mui/material/Button'

export default function AccessControl({
                                          signInRequired = false,
                                          requiredRoles = [],
                                          allowedRoles = [],
                                          denyAccess = false,
                                          signInText = 'to continue',
                                          dialogContent,
                                          continueTo,
                                          children
                                      }) {
    const {authLoaded, isLoggedIn} = useContext(AuthContext)
    const {accessInfo} = useAccess()
    const containerRef = useRef(null)
    const navigate = useNavigate()

    const notAuthorizedContent = continueTo
        ? <div>
            {dialogContent}
            <div style={{width: '100%', marginTop: 10, textAlign: 'right'}}>
                <Button onClick={() => navigate(continueTo)} variant='text' color='inherit'>Continue</Button>
            </div>
        </div>
        : dialogContent

    if (!authLoaded) return <LoadingDisplayNav/>

    if (authLoaded && !isLoggedIn) {
        return (
            <LoadingDisplayNav>
                <div ref={containerRef}>
                    <Box sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        isolation: 'isolate'
                    }}>
                        <SignInDetect
                            required={signInRequired}
                            dialog={true}
                            linkText={`You must be signed in ${signInText}.`}
                            containerRef={containerRef}/>
                    </Box>
                </div>
            </LoadingDisplayNav>
        )
    }

    if (requiredRoles.length && !requiredRoles.some(role => accessInfo.roles[role])) {
        return <Navigate to='/locks' replace/>
    }

    if ((allowedRoles.length && !allowedRoles.some(role => accessInfo.roles[role])) || denyAccess) {
        return (
            <LoadingDisplayNav>
                <ScopedDialog
                    open={true}
                    dialogContent={notAuthorizedContent}
                    containerRef={containerRef}
                    width={400}
                    position={{top: 80}}
                    centerX={true}
                />
            </LoadingDisplayNav>
        )
    }


    return children
}