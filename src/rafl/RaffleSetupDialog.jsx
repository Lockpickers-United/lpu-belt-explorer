import Dialog from '@mui/material/Dialog'
import AdminToolsButton from './AdminToolsButton.jsx'
import React, {useContext} from 'react'
import RaffleContext from './RaffleContext.jsx'
import RAFL2026 from '../resources/hello-my-name-is-RAFL-2026s.png'
import Box from '@mui/material/Box'

export default function RaffleSetupDialog() {
    const {raffleAdminRole, raflState} = useContext(RaffleContext)

    return (
        <Dialog open={raflState === 'setup' && !raffleAdminRole}
                componentsProps={{
                    backdrop: {style: {backgroundColor: '#000', opacity: 1}}
                }}
                sx = {{
                    '.MuiDialog-paper': {
                        backgroundColor: '#000', opacity: 1, backgroundImage: 'none'
                    }
                }}>
            <div style={{textAlign: 'center', padding: 20, maxWidth: 400}}>
                <Box component='img' alt='Lock Pickers United' src={RAFL2026} style={{
                    marginLeft: 'auto', marginRight: 'auto', display: 'block',
                    width: '100%', margin: '30px 0px 30px'
                }}/>
                <br/>
                <div style={{fontSize: '1.2rem', marginBottom:150}}>Stay tuned!</div>
                <br/>

                <AdminToolsButton/>
            </div>
        </Dialog>
    )

}