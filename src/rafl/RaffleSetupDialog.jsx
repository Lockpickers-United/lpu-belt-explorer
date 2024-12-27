import Dialog from '@mui/material/Dialog'
import AdminRoleButton from './AdminRoleButton.jsx'
import React, {useContext} from 'react'
import RaffleContext from './RaffleContext.jsx'

export default function RaffleSetupDialog() {
    const {raffleAdminRole, raflState} = useContext(RaffleContext)

    return (
        <Dialog open={raflState === 'setup' && !raffleAdminRole} componentsProps={{
            backdrop: {style: {backgroundColor: '#000', opacity: 1}}
        }}>
            <div style={{width: 350, textAlign: 'center', padding: 30}}>
                <div style={{fontSize: '1.3rem', fontWeight: 700}}>Almost there...</div>
                <br/>
                <div style={{fontSize: '1.2rem'}}>RAFL launches on January 1st!</div>
                <br/>

                <AdminRoleButton/>
            </div>
        </Dialog>
    )

}