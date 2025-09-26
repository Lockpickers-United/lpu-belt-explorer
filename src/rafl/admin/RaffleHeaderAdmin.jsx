import React, {useCallback, useContext} from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'
import Button from '@mui/material/Button'
import RaffleContext from '../RaffleContext.jsx'
import {useNavigate} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RafflePreviewBar from '../RafflePreviewBar.jsx'

export default function RaffleHeaderAdmin({page, width = 700}) {

    const {raffleAdminRole, setRaffleAdminRole, preview, setPreview, refresh} = useContext(RaffleContext)

    const navigate = useNavigate()
    const {setAnimateTotal} = useContext(RaffleContext)

    const handleRoleClick = useCallback(() => {
        if (preview && raffleAdminRole) setPreview(false)
        const isAdminRole = raffleAdminRole
        setRaffleAdminRole(!raffleAdminRole)
        if (isAdminRole) navigate('/rafl')
    }, [navigate, preview, raffleAdminRole, setPreview, setRaffleAdminRole])


    const handleChange = useCallback((page) => {
        navigate(page)
        setAnimateTotal(false)
    }, [navigate, setAnimateTotal])


    const {isMobile} = useWindowSize()
    const buttonFontSize = !isMobile ? '1.03rem' : '1.0rem'

    const style = {
        maxWidth: width,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        alignItems: 'center',
    }

    return (
        <React.Fragment>
            <div style={style}>
                <IconButton style={{padding: 4, marginRight: 10}} onClick={handleRoleClick}>
                    <AdminPanelSettingsIcon fontSize='medium' style={{color: '#fff'}}/>
                </IconButton>
                <Button onClick={() => handleChange('/rafl/admin')}
                        style={{
                            padding: '0px 8px',
                            marginRight: 10,
                            color: page === 'entries' ? '#fff' : '#ccc',
                            fontSize: buttonFontSize
                        }}
                        sx={{':hover': {bgcolor: '#333', color: '#fff'}}}
                        disabled={page === 'entries'}>
                    ENTRIES
                </Button>
                    <Button onClick={() => handleChange('/rafl/reports')}
                            style={{
                                padding: '0px 8px',
                                marginRight: 10,
                                color: page === 'reports' ? '#fff' : '#ccc',
                                fontSize: buttonFontSize
                            }}
                            sx={{':hover': {bgcolor: '#333', color: '#fff'}}}
                            disabled={page === 'reports'}>
                        REPORTS
                    </Button>
                <Button onClick={() => handleChange('/rafl/admin/drawing')}
                        style={{
                            padding: '0px 8px',
                            marginRight: 10,
                            color: page === 'drawing' ? '#fff' : '#ccc',
                            fontSize: buttonFontSize
                        }}
                        sx={{':hover': {bgcolor: '#333', color: '#fff'}}}
                        disabled={page === 'drawing'}>
                    DRAW WINNERS
                </Button>
                <div style={{display: 'flex', flexGrow: 1, justifyContent: 'right'}}>
                    <RafflePreviewBar page={page} refresh={refresh}/>
                </div>
            </div>
            <div style={{height: 8}}/>
        </React.Fragment>
    )

}



