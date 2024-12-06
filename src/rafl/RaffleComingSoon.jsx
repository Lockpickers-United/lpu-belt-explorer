import Dialog from '@mui/material/Dialog'
import AdminRoleButton from './AdminRoleButton.jsx'
import React, {useContext} from 'react'
import RaffleContext from './RaffleContext.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'


export default function RaffleComingSoon() {
    const {live, raffleAdminRole} = useContext(RaffleContext)
    const navigate = useNavigate()

    return (
        <Dialog open={!live && !raffleAdminRole} componentsProps={{
            backdrop: {style: {backgroundColor: '#000', opacity: 0.9}}
        }}>
            <div style={{width: 320, textAlign: 'center', padding: 30}}>
                <span style={{fontSize: '1.3rem', fontWeight: 700}}>RAFL is launching soon!</span><br/><br/>
                <span style={{fontSize: '1.2rem'}}>Come back in January<br/> to enter.<br/><br/></span>

                <Link onClick={() => navigate('/rafl')}
                      style={{color: '#ddd', textDecorationColor: '#888', fontSize: '0.9rem', cursor:'pointer'}}>
                    Take a sneak peak at the pots!
                </Link><br/>

                <AdminRoleButton/>
            </div>
        </Dialog>

    )

}