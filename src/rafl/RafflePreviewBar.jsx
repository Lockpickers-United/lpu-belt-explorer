import React, {useCallback, useState} from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CachedIcon from '@mui/icons-material/Cached'
import LoadingDisplayWhite from '../misc/LoadingDisplayWhite.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionSummary from '@mui/material/AccordionSummary'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'

export default function RafflePreviewBar({refresh}) {

    const [requestingPreview, setRequestingPreview] = useState(false)
    const [response, setResponse] = useState('')
    const [open, setOpen] = useState(false)

    const refreshPreview = useCallback(async () => {
        const url = window.location.protocol === 'http:'
            ? 'http' + '://explore.lpubelts.com:8080/refresh-preview'
            : 'https://explore.lpubelts.com:8443/refresh-preview'

        setRequestingPreview(true)

        await fetch(url, {cache: 'no-store'})
            .then(async res => {
                setRequestingPreview(false)
                return await res.json()
            })
            .then(async response => {
                setResponse(response)
                console.log('preview response\n', response)
            })

        await refresh()

    }, [refresh])

    return (
        <React.Fragment>
            <div style={{
                maxWidth: 700,
                margin: '20px auto 10px auto',
                padding: 2,
                fontWeight: 700,
                fontSize: '1.2rem',
                backgroundColor: '#8830d3',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{flexGrow: 1, marginLeft: 20}}>PREVIEW MODE</div>

                {requestingPreview
                    ? <LoadingDisplayWhite/>
                    : <Tooltip title={'Refresh From Sheet'} arrow disableFocusListener>
                        <IconButton onClick={refreshPreview} style={{marginRight: 10}}>
                            <CachedIcon/>
                        </IconButton>
                    </Tooltip>

                }
            </div>

            {response?.status === 'Errors' &&
                <Accordion expanded={open} onChange={() => setOpen(!open)} sx={{
                    '.MuiAccordionSummary-content': {
                        margin: 0
                    }
                }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>} style={{
                        maxWidth: 700,
                        margin: '0px auto 10px auto',
                        paddingLeft: 20,
                        fontWeight: 700,
                        fontSize: '1rem',
                        backgroundColor: '#e34141'
                    }}>
                        There were errors trying to import
                    </AccordionSummary>
                    <AccordionDetails style={{
                        maxWidth: 700,
                        margin: '20px auto 10px auto',
                        padding: 10,
                        fontWeight: 400,
                        fontSize: '0.8rem',
                        backgroundColor: '#e34141',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <pre>{JSON.stringify(response, null, 2)}</pre>

                    </AccordionDetails>
                </Accordion>
            }
        </React.Fragment>

    )

}