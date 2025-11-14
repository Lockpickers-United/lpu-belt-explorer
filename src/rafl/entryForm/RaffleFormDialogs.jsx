import React, {useContext} from 'react'
import SignInDetect from '../../auth/SignInDetect.jsx'
import RaffleContext from '../RaffleContext.jsx'
import RaffleNotLiveDialog from '../RaffleNotLiveDialog.jsx'

export default function RaffleFormDialogs({containerRef}) {
    const {raflState} = useContext(RaffleContext)

    return (
        <>
            {raflState === 'live'
                ? <SignInDetect required={true} dialog={false} linkText={'You must be signed in to enter the Raffle.'}
                                containerRef={containerRef}/>
                : <RaffleNotLiveDialog/>
            }
        </>
    )

}