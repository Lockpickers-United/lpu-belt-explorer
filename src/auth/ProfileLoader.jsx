import React, {useContext, useRef} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import SignInDetect from './SignInDetect.jsx'
import Box from '@mui/material/Box'

export default function ProfileLoader({loading, dialogText = 'to continue', required = false}) {

    const {authLoaded} = useContext(AuthContext)
    const containerRef = useRef(null)

    // TODO: handle error states?

    return (
        <Box sx={{
            position: 'relative',
            overflow: 'hidden',
            isolation: 'isolate'
        }}>


            <SignInDetect required={required} dialog={false} linkText={`You must be signed in ${dialogText}.`}
                          containerRef={containerRef}/>

            {(loading || !authLoaded) && <LoadingDisplay/>}

        </Box>

    )
}