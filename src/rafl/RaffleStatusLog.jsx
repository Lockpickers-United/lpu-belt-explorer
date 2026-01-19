import {useContext} from 'react'
import RaffleContext from './RaffleContext.jsx'

export default function RaffleStatusLog() {
    const {raffleAdmin, raffleAdminRole, raflState} = useContext(RaffleContext)
    const adminState = raffleAdminRole ? ' (raffleAdminRole)' : ''
    //if (raffleAdmin) console.log('RaffleParentRoute, status:', raflState, adminState)
}