import React, {useCallback, useContext} from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'
import Button from '@mui/material/Button'
import RaffleContext from '../RaffleContext.jsx'
import {useNavigate, useSearchParams} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RafflePreviewBar from '../RafflePreviewBar.jsx'

export default function RaffleHeaderAdmin({page, width = 700}) {

    const {preview, setPreview, refresh} = useContext(RaffleContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const previewMode = searchParams.has('preview')
    const showPreview = preview || previewMode

    const navigate = useNavigate()
    const {setAnimateTotal} = useContext(RaffleContext)

    const handleChange = useCallback((page) => {
        navigate(page)
        setAnimateTotal(false)
    }, [navigate, setAnimateTotal])

    const togglePreview = useCallback(() => {
        if (showPreview && page === 'pots') {
            searchParams.delete('preview')
            setSearchParams(searchParams)
            setPreview(false)
        }
    }, [page, searchParams, setPreview, setSearchParams, showPreview])


    const {isMobile} = useWindowSize()
    const buttonFontSize = !isMobile ? '1.03rem' : '1.0rem'
    const shouldShowNavButtons = !preview || page !== 'pots' || !isMobile

    const style = {
        maxWidth: width,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        alignItems: 'center',
        height: 40
    }

    return (
        <React.Fragment>
            <div style={style}>
                    <IconButton style={{padding: 4}} onClick={togglePreview} disabled={page !== 'pots'}>
                        <AdminPanelSettingsIcon fontSize='medium' style={{color: '#4c82fd'}}/>
                    </IconButton>
                {shouldShowNavButtons &&
                    <React.Fragment>
                        <Button onClick={() => handleChange('/rafl/admin')}
                                style={{
                                    padding: '0px 8px',
                                    marginRight: 10,
                                    marginLeft: 10,
                                    color: page === 'entries' ? '#48adf1' : '#ccc',
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
                                    color: page === 'reports' ? '#48adf1' : '#ccc',
                                    fontSize: buttonFontSize
                                }}
                                sx={{':hover': {bgcolor: '#333', color: '#fff'}}}
                                disabled={page === 'reports'}>
                            REPORTS
                        </Button>
                    </React.Fragment>
                }
                <div style={{display: 'flex', flexGrow: 1, justifyContent: 'right'}}>
                    <RafflePreviewBar page={page} refresh={refresh}/>
                </div>
            </div>
            <div style={{height: 2}}/>
        </React.Fragment>
    )

}



