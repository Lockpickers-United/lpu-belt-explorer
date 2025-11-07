import Dialog from '@mui/material/Dialog'
import AdminToolsButton from './AdminToolsButton.jsx'
import React, {useContext} from 'react'
import RaffleContext from './RaffleContext.jsx'

export default function RaffleHiddenDialog() {
    const {raffleAdminRole, raflState} = useContext(RaffleContext)

    return (
        <Dialog open={raflState === 'hidden' && !raffleAdminRole} componentsProps={{
            backdrop: {style: {backgroundColor: '#000', opacity: 0.9}}
        }}>
            <div style={{width: 320, textAlign: 'center', padding: 30}}>
                <div style={{fontSize: '1.3rem', fontWeight: 700}}>RAFL has ended</div>
                <br/>
                <div style={{fontSize: '1.2rem'}}>See you next year!</div>
                <br/>

                <AdminToolsButton/>
            </div>
        </Dialog>
    )

}