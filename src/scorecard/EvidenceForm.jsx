import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import React, {useCallback, useContext, useState} from 'react'
import dayjs from 'dayjs'
import {enqueueSnackbar} from 'notistack'
import DBContext from '../app/DBContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'

export default function EvidenceForm({evid, lockId}) {
    const {addEvidence, updateEvidence, removeEvidence} = useContext(DBContext)

    const [evidenceName, setEvidenceName] = useState(evid?.name ? evid?.name : '')
    const [evidenceUrl, setEvidenceUrl] = useState(evid?.link ? evid?.link + '' : '')
    const [evidenceDate, setEvidenceDate] = useState(evid?.date ? dayjs(evid.date) : dayjs())
    const [modifier, setModifier] = useState(evid?.modifier ? evid?.modifier : '')
    const [updated, setUpdated] = useState(false)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const handleSave = useCallback(async () => {
        try {
            if (evid?.id) {
                updateEvidence(evid.id, {
                    matchId: evid.matchId,
                    name: evidenceName,
                    link: evidenceUrl,
                    date: evidenceDate,
                    modifier: modifier
                })
            } else {
                addEvidence({
                    matchId: lockId,
                    name: evidenceName,
                    link: evidenceUrl,
                    date: evidenceDate,
                    modifier: modifier
                })
            }
            enqueueSnackbar('Scorecard updated')
            setUpdated(false)
        } catch (ex) {
            console.error('Error while updating scorecard', ex)
            enqueueSnackbar('Error while updating scorecard')
        }
    }, [addEvidence, evid?.id, evid?.matchId, evidenceDate, evidenceName, evidenceUrl, lockId, modifier, updateEvidence])

    const handleDelete = useCallback(async (event) => {
        try {
            removeEvidence(evid.id)
            enqueueSnackbar('Entry deleted')
        } catch (ex) {
            console.error('Error while deleting entry', ex)
            enqueueSnackbar('Error while deleting entry')
        }
        setAnchorEl(null)
    }, [evid?.id, removeEvidence])

    const cancelEdit = useCallback(() => {
        if (updated) {
            setEvidenceUrl(evid.link)
            setUpdated(false)
            setEvidenceName(evid.name)
        }
    }, [evid?.link, evid?.name, updated])

    const processURL = useCallback(event => {
        const {value} = event.target
        setEvidenceUrl(value)
        setUpdated(true)
    }, [])

    const evidenceUrlValid = isValidHttpUrl(evidenceUrl)
    const evidenceUrlError = (!!evidenceUrl && !isValidHttpUrl(evidenceUrl)) || (updated && !evidenceUrl)
    const evidenceURLHelperText = evidenceUrlError ? 'Documentation link is not valid' : ''
    const evidenceLaunchColor = evidenceUrlValid ? '#fff' : '#666'
    const saveEntryColor = updated && !evidenceUrlError ? '#fff' : '#555'
    const cancelColor = updated ? '#e15c07' : '#555'
    const urlFieldColor = evidenceUrlError ? 'error' : 'secondary'

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <React.Fragment>
                <div style={{display: 'flex', width: '95%', marginBottom: 10}}>
                    <TextField
                        id='evidence-url'
                        error={!!evidenceUrlError}
                        helperText={evidenceURLHelperText}
                        label='Documentation Link'
                        value={evidenceUrl}
                        placeholder='https://youtu.be/'
                        fullWidth
                        size='small'
                        margin='dense'
                        color={urlFieldColor}
                        onChange={processURL}
                    />
                    <IconButton disabled={evidenceUrlError || !evidenceUrl}>
                        <a href={evidenceUrl} target='_blank' rel='noreferrer'>
                            <LaunchIcon style={{fontSize: 'large', color: evidenceLaunchColor}}/></a>
                    </IconButton>
                </div>

                <div style={{display: 'flex', width: '95%', marginBottom: 20}}>

                    <DatePicker
                        label='Pick date'
                        value={evidenceDate}
                        onChange={(newValue) => {
                            setEvidenceDate(newValue)
                            setUpdated(true)
                        }}
                        sx={{width: 250}}
                        disableFuture
                    />

                    <TextField
                        select
                        style={{marginLeft: 30, width: 250}}
                        id='modifier'
                        label='Modifier'
                        value={modifier ?? ''}
                        color='secondary'
                        onChange={e => {
                            setModifier(e.target.value)
                            setUpdated(true)
                        }}
                    >
                        <MenuItem value=''>(None)</MenuItem>
                        <MenuItem value='First Recorded Pick'>First Recorded Pick</MenuItem>
                        <MenuItem value='First Recorded Pick (Notable)'>First Recorded Pick (Notable)</MenuItem>
                        <MenuItem value='Non-Picking Defeat'>Non-Picking Defeat</MenuItem>
                        <MenuItem value='First Recorded Defeat'>First Recorded Defeat</MenuItem>
                        <MenuItem value='First Recorded Defeat (Notable)'>First Recorded Defeat
                            (Notable)</MenuItem>
                    </TextField>

                </div>

                <div style={{display: 'flex', width: '90%', marginBottom: 20}}>
                    <TextField
                        id='evidence-notes'
                        label='Notes (optional)'
                        value={evidenceName}
                        placeholder='https://youtu.be/'
                        fullWidth
                        size='small'
                        margin='dense'
                        color='secondary'
                        onChange={e => {
                            setEvidenceName(e.target.value)
                            setUpdated(true)
                        }}
                        sx={{input: {color: '#999'}}}
                    />
                </div>

                <div style={{display: 'flex'}}>
                    <div style={{marginLeft: 0}}>
                        <Button style={{marginRight: 10, color: '#d00'}} onClick={handleOpen} edge='start'>
                            Delete
                        </Button>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <div style={{padding: 20, textAlign: 'center'}}>
                                You cannot undo delete.<br/>
                                Are you sure?
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <Button style={{marginBottom: 10, color: '#000'}}
                                        variant='contained'
                                        onClick={handleDelete}
                                        edge='start'
                                        color='error'
                                >
                                    Delete
                                </Button>
                            </div>
                        </Menu>
                    </div>
                    <div style={{
                        width: '100%',
                        textAlign: 'right',
                        padding: '0px 12px 8px 0px'
                    }}>
                        <Button style={{marginRight: 10, color: cancelColor}}
                                onClick={cancelEdit}
                                disabled={!updated}
                        >
                            Cancel
                        </Button>
                        <Button style={{marginRight: 0, color: saveEntryColor}}
                                onClick={handleSave}
                                disabled={!updated || evidenceUrlError}
                        >
                            Save
                        </Button>
                    </div>
                </div>

            </React.Fragment>

        </LocalizationProvider>
    )

    function isValidHttpUrl(string) {
        let url
        try {
            url = new URL(string)
        } catch (_) {
            return false
        }
        return url.protocol === 'http:' || url.protocol === 'https:'
    }

}