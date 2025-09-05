import Dialog from '@mui/material/Dialog'
import AdminToolsButton from './AdminToolsButton.jsx'
import React, {useContext} from 'react'
import RaffleContext from './RaffleContext.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'

export default function RaffleNotLiveDialog() {
    const {raffleAdminRole, raflState} = useContext(RaffleContext)
    const navigate = useNavigate()

    return (
        <React.Fragment>
            <Dialog open={(raflState === 'preview' || raflState === 'setup') && !raffleAdminRole} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.9}}
            }}>
                <div style={{width: 320, textAlign: 'center', padding: 30}}>
                    <span style={{fontSize: '1.3rem', fontWeight: 700}}>RAFL is launching soon!</span><br/><br/>
                    <span style={{fontSize: '1.2rem'}}>Come back on January 1st<br/> to enter.<br/><br/></span>
                    {raflState === 'preview' &&
                    <Link onClick={() => navigate('/rafl')}
                          style={{color: '#ddd', textDecorationColor: '#888', fontSize: '0.9rem', cursor: 'pointer'}}>
                        Take a sneak peek at the pots!
                    </Link>
                    }
                    <br/>
                    <AdminToolsButton/>
                </div>
            </Dialog>

            <Dialog open={raflState === 'post' && !raffleAdminRole} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.9}}
            }}>
                <div style={{width: 320, textAlign: 'center', padding: 30}}>
                    <span style={{fontSize: '1.3rem', fontWeight: 700}}>RAFL has ended</span><br/><br/>
                    <Link onClick={() => navigate('/rafl')}
                          style={{color: '#ddd', textDecorationColor: '#888', fontSize: '1.1rem', cursor: 'pointer'}}>
                        Click here to view the winners.
                    </Link><br/>
                    <AdminToolsButton/>
                </div>
            </Dialog>

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
        </React.Fragment>
    )

}