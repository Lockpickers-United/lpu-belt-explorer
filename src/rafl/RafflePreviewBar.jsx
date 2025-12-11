import React, {useCallback, useContext, useRef, useState} from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CachedIcon from '@mui/icons-material/Cached'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionSummary from '@mui/material/AccordionSummary'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import {useSearchParams} from 'react-router-dom'
import RaffleContext from './RaffleContext.jsx'
import Button from '@mui/material/Button'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {useHotkeys} from 'react-hotkeys-hook'
import LoadingDisplayWhiteSmall from '../misc/LoadingDisplayWhiteSmall.jsx'
import Slide from '@mui/material/Slide'
import Box from '@mui/material/Box'
import {nodeServerUrl} from '../data/dataUrls'
import {getData} from '../formUtils/getData.jsx'
import {enqueueSnackbar} from 'notistack'
import AppContext from '../app/AppContext.jsx'
import dayjs from 'dayjs'

export default function RafflePreviewBar({refresh, page}) {
    const [requestingPreview, setRequestingPreview] = useState(false)
    const [response, setResponse] = useState('')
    const [open, setOpen] = useState(false)

    const {preview, setPreview, raflPreviewVersion} = useContext(RaffleContext)
    const {version} = useContext(AppContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const previewMode = searchParams.has('preview')
    const showPreview = preview || previewMode

    const oldPreview = dayjs(version).valueOf() > dayjs(raflPreviewVersion.version).valueOf()

    const refreshPreview = useCallback(async () => {
        const url = `${nodeServerUrl}/refresh-preview`
        try {
            setRequestingPreview(true)
            const results = await getData({url, snackBars: false, timeoutDuration: 30000})
            enqueueSnackbar('Request successful', {variant: 'success'})
            setResponse(results)
        } catch (error) {
            enqueueSnackbar(`Error creating request: ${error.message}`, {variant: 'error', autoHideDuration: 3000})
        } finally {
            setRequestingPreview(false)
        }
        await refresh()
    }, [refresh])

    const containerRef = useRef(null)

    const togglePreview = useCallback(() => {
        if (previewMode) {
            searchParams.delete('preview')
            setSearchParams(searchParams)
            setPreview(false)
        } else {
            setPreview(!preview)
        }
    }, [preview, previewMode, searchParams, setPreview, setSearchParams])

    useHotkeys('p', () => togglePreview(), {preventDefault: true})

    const color = showPreview ? '#983de6' : '#fff'

    return (
        <React.Fragment>
            {page !== 'pots'
                ? <Box ref={containerRef}
                       style={{
                           display: 'flex',
                           alignItems: 'center',
                           overflow: 'hidden'
                       }}>
                    <IconButton style={{padding: 8}} disabled>
                        <VisibilityIcon style={{color: color, opacity: 0.5}} fontSize='small'/>
                    </IconButton>
                </Box>
                : <div>
                    <Box ref={containerRef}
                         style={{
                             display: 'flex',
                             alignItems: 'center',
                             overflow: 'hidden'
                         }}>
                        {!showPreview
                            ? <Tooltip title='Toggle Preview Mode' arrow disableFocusListener>
                                <IconButton onClick={togglePreview} style={{padding: 8}}>
                                    <VisibilityIcon style={{color: color}} fontSize='small'/>
                                </IconButton>
                            </Tooltip>

                            : <Slide in={showPreview} direction='left' appear={false}>
                                <div style={{display: 'flex', flexGrow: 1, marginRight: 0}}>
                                    <Button onClick={togglePreview}
                                            style={{
                                                padding: '0px 8px 0px 0px',
                                                marginRight: 0,
                                                color: '#8830d3',
                                                fontSize: '1.0rem',
                                                lineHeight: '1.2rem',
                                                whiteSpace: 'nowrap'
                                            }}
                                    >
                                        PREVIEW MODE ON
                                    </Button>

                                    {requestingPreview
                                        ? <div style={{marginRight: 0}}>
                                            <LoadingDisplayWhiteSmall diameter={36}/>
                                        </div>
                                        : <Tooltip title={'Refresh From Sheet'} arrow disableFocusListener>
                                            <IconButton onClick={refreshPreview} style={{marginRight: 0}}>
                                                <CachedIcon fontSize='small'/>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    <IconButton onClick={togglePreview} style={{padding: 8}}>
                                        <VisibilityIcon style={{color: color}} fontSize='small'/>
                                    </IconButton>

                                </div>
                            </Slide>
                        }
                    </Box>
                    {oldPreview && showPreview &&
                        <div style={{fontSize: '0.8rem', color: '#d33030'}}>
                            Preview version is older than latest import.
                        </div>
                    }
                </div>
            }

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