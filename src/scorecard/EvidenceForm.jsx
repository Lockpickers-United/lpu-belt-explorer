import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import React, {useCallback, useContext, useState} from 'react'
import {useParams} from 'react-router-dom'
import dayjs from 'dayjs'
import {enqueueSnackbar} from 'notistack'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import isValidUrl from '../util/isValidUrl'
import allProjects from '../data/projects.json'
import Autocomplete from '@mui/material/Autocomplete'
import CollectionButton from '../entries/CollectionButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import {getEntryFromId} from '../entries/entryutils'

export default function EvidenceForm({evid, lockId, handleUpdate, addProject, source}) {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const {addEvidence, updateEvidence, removeEvidence} = useContext(DBContext)

    const [evidenceNotes, setEvidenceNotes] = useState(evid?.evidenceNotes ? evid?.evidenceNotes : '')
    const [evidenceUrl, setEvidenceUrl] = useState(evid?.link ? evid?.link + '' : '')
    const [evidenceDate, setEvidenceDate] = useState(evid?.date ? dayjs(evid.date) : dayjs())
    const [modifier, setModifier] = useState(evid?.modifier ? evid?.modifier : '')
    const [updated, setUpdated] = useState(false)

    const [projectName, setProjectName] = useState('')
    const projectValues = allProjects.map(project => {
        return {label: project.name, value: project.id}
    })

    const project = allProjects.find(item => {
        return item.name === projectName
    })
    const entry = getEntryFromId(evid?.matchId || lockId)

    const entryId = entry
        ? entry.id
        : project
            ? project.id
            : null

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
            if (evid?.id && evid?.matchId) {
                updateEvidence(evid, {
                    matchId: evid.matchId,
                    evidenceNotes: evidenceNotes,
                    link: evidenceUrl,
                    date: evidenceDate,
                    modifier: modifier
                })
            } else {
                const evidUserId = userId || user.uid
                addEvidence(evidUserId, {
                    matchId: entryId,
                    evidenceNotes: evidenceNotes,
                    notes: evidenceNotes,
                    link: evidenceUrl,
                    date: evidenceDate,
                    modifier: modifier
                })
            }
            enqueueSnackbar('Scorecard updated')
            setUpdated(false)
            handleUpdate()
        } catch (ex) {
            console.error('Error while updating scorecard', ex)
            enqueueSnackbar('Error while updating scorecard')
        }
    }, [user, userId, addEvidence, entryId, evid, evidenceDate, evidenceNotes, evidenceUrl, handleUpdate, modifier, updateEvidence])

    const handleDelete = useCallback(async () => {
        try {
            removeEvidence(evid)
            enqueueSnackbar('Entry deleted')
            handleUpdate()
        } catch (ex) {
            console.error('Error while deleting entry', ex)
            enqueueSnackbar('Error while deleting entry')
        }
        setAnchorEl(null)
    }, [evid, handleUpdate, removeEvidence])

    const cancelEdit = useCallback(() => {
        if (updated) {
            setEvidenceUrl(evid?.link ? evid.link : '')
            setEvidenceDate(evid?.date ? dayjs(evid.date) : dayjs())
            setModifier(evid?.modifier ? evid?.modifier : '')
            setEvidenceNotes(evid?.evidenceNotes ? evid.evidenceNotes : '')
            setUpdated(false)
        }
    }, [evid?.link, evid?.date, evid?.modifier, evid?.evidenceNotes, updated])

    const processURL = useCallback(event => {
        const {value} = event.target
        setEvidenceUrl(value)
        setUpdated(true)
    }, [])

    const evidenceUrlValid = isValidUrl(evidenceUrl)
    const evidenceUrlError = (!!evidenceUrl && !isValidUrl(evidenceUrl)) || (updated && !evidenceUrl)
    const evidenceURLHelperText = evidenceUrlError ? 'Documentation link is not valid' : ''
    const evidenceLaunchColor = evidenceUrlValid ? '#fff' : '#666'
    const saveEntryColor = updated && !evidenceUrlError ? '#fff' : '#555'
    const cancelColor = updated ? '#e15c07' : '#555'
    const urlFieldColor = evidenceUrlError ? 'error' : 'secondary'

    const {isMobile} = useWindowSize()
    const denseButton = !!isMobile
    const buttonWidth = isMobile ? 50 : 250

    return (
        <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

            <React.Fragment>

                {addProject &&
                    <Autocomplete
                        disablePortal
                        options={projectValues}
                        style={{maxWidth: 400, marginBottom: 10}}
                        onInputChange={(event, newInputValue) => {
                            setProjectName(newInputValue)
                            setUpdated(true)
                        }}
                        renderInput={(params) => <TextField {...params} label='Project' color='secondary'/>}
                    />
                }

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
                        value={evidenceNotes}
                        placeholder='https://youtu.be/'
                        fullWidth
                        size='small'
                        margin='dense'
                        color='secondary'
                        onChange={e => {
                            setEvidenceNotes(e.target.value)
                            setUpdated(true)
                        }}
                        sx={{input: {color: '#999'}}}
                    />
                    {(!!entry && source !== 'collectionButton') &&
                        <div style={{width: buttonWidth, textAlign: 'right', marginTop: 10}}>
                            <CollectionButton id={evid?.matchId || lockId} dense={denseButton}/>
                        </div>
                    }
                </div>

                <div style={{display: 'flex'}}>
                    <div style={{marginLeft: 0}}>
                        <Button style={{marginRight: 10, color: '#d00'}} onClick={handleOpen} edge='start'
                                disabled={!evid}>
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
}