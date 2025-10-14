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
import allAwards from '../data/awards.json'
import Autocomplete from '@mui/material/Autocomplete'
import CollectionButton from '../entries/CollectionButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import {getEntryFromId, isAward} from '../entries/entryutils'
import EvidenceLockSearchBox from './EvidenceLockSearchBox.jsx'
import DataContext from '../context/DataContext.jsx'
import AppContext from '../app/AppContext.jsx'
import ViewPageDrawer from '../viewPage/ViewPageDrawer.jsx'
import sanitizeValues from '../util/sanitizeValues'


export default function EvidenceForm({activity, lockId, handleUpdate, addLock, addProject, addAward, source}) {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const {admin} = useContext(AppContext)
    const {blackBeltUser} = useContext(DataContext)

    const {addPickerActivity, updatePickerActivity, removePickerActivity, userLockNotes, updateProfileField} = useContext(DBContext)

    const [evidenceUrl, setEvidenceUrl] = useState(activity?.link ? activity.link + '' : '')
    const [evidenceDate, setEvidenceDate] = useState(activity?.date ? dayjs(activity.date) : dayjs())
    const [modifier, setModifier] = useState(activity?.evidenceModifier ? activity.evidenceModifier : '')
    const [updated, setUpdated] = useState(false)

    const awardMode = addAward || isAward(activity?.matchId)
    const [entryName, setEntryName] = useState(null)
    const [lockSelectId, setLockSelectId] = useState(null)
    const entry = getEntryFromId(activity?.matchId || lockId)


    const project = allProjects.find(item => {
        return item.name === entryName
    })
    const award = allAwards.find(item => {
        return item.makeModels[0].model === entryName
    })
    const entryValues = addAward
        ? allAwards.map(award => award.makeModels[0].model)
        : allProjects.map(project => project.name)

    const entryId = entry
        ? entry.id
        : lockSelectId
            ? lockSelectId
            : project
                ? project.id
                : award
                    ? award.id
                    : null

    const lockNotes = userLockNotes[entry?.id] || {}
    const notes = typeof lockNotes === 'string'
        ? lockNotes || ''
        : (lockNotes && lockNotes.notes) || ''
    const [entryNotes, setEntryNotes] = useState(notes || '')


    const fieldLabel = addAward
        ? 'Belt/Dan'
        : addProject
            ? 'Project'
            : 'Lock'

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const handleChangeLock = useCallback(lockDetails => {
        setLockSelectId(lockDetails.lockId)
    }, [])

    const saveEntryNotes = useCallback(async () => {

        if (entryNotes === userLockNotes[entryId]) return

        const updatedUserLockNotes = {
            ...userLockNotes,
            [entryId]: entryNotes
        }
        if (entryNotes.length === 0) {
            delete updatedUserLockNotes[entryId]
        }
        await updateProfileField('userLockNotes', updatedUserLockNotes)
            .catch(error => {
                console.error('Error updating notes:', error)
            })
    }, [entryNotes, userLockNotes, entryId, updateProfileField])

    const handleSave = useCallback(async () => {
        try {
            setUpdated(false)
            if (activity?.id) {
                await updatePickerActivity(activity, {
                    matchId: activity.matchId,
                    link: evidenceUrl,
                    date: evidenceDate,
                    evidenceModifier: modifier
                })
                await saveEntryNotes()
            } else {
                const evidUserId = userId || user.uid
                await addPickerActivity(evidUserId, {
                    matchId: entryId,
                    link: evidenceUrl,
                    date: evidenceDate,
                    evidenceModifier: modifier
                })
                await saveEntryNotes()
            }
            enqueueSnackbar('Scorecard updated')
            handleUpdate()
        } catch (ex) {
            console.error('Error while updating scorecard', ex)
            enqueueSnackbar('Error while updating scorecard')
        }
    }, [activity, handleUpdate, updatePickerActivity, evidenceUrl, evidenceDate, modifier, saveEntryNotes, userId, user.uid, addPickerActivity, entryId])

    const handleDelete = useCallback(async () => {
        try {
            await removePickerActivity(activity)
            enqueueSnackbar('Entry deleted')
            handleUpdate()
        } catch (ex) {
            console.error('Error while deleting entry', ex)
            enqueueSnackbar('Error while deleting entry')
        }
        setAnchorEl(null)
    }, [activity, handleUpdate, removePickerActivity])

    const cancelEdit = useCallback(() => {
        if (updated) {
            setEvidenceUrl(activity?.link ? activity.link : '')
            setEvidenceDate(activity?.date ? dayjs(activity.date) : dayjs())
            setModifier(activity?.evidenceModifier ? activity.evidenceModifier : '')
            setEntryNotes(entryNotes)

            setUpdated(false)
            handleUpdate()
        } else {
            handleUpdate()
        }
    }, [activity, entryNotes, handleUpdate, updated])

    const processURL = useCallback(event => {
        const {value} = event.target
        setEvidenceUrl(value)
        setUpdated(true)
    }, [])

    const evidenceUrlValid = isValidUrl(evidenceUrl)
    const evidenceUrlError = (!!evidenceUrl && !isValidUrl(evidenceUrl) || ((updated && !evidenceUrl)) && !awardMode)
    const evidenceURLHelperText = evidenceUrlError ? 'Documentation link is not valid' : ''
    const evidenceLaunchColor = evidenceUrlValid ? '#fff' : '#666'
    const saveEntryColor = updated && !evidenceUrlError && !!entryId ? '#fff' : '#555'
    const cancelColor = '#e15c07'
    const urlFieldColor = evidenceUrlError ? 'error' : 'secondary'
    const entryError = evidenceUrlError || (addProject && !entryValues.includes(entryName))

    const {isMobile} = useWindowSize()
    const denseButton = !!isMobile
    const buttonWidth = isMobile ? 50 : 250
    const minWidth = isMobile ? 290 : 500
    const notesBaseRows = isMobile ? 5 : 3
    const notesLineBreaks = entryNotes.split('\n').length
    const notesRows = notesLineBreaks > notesBaseRows ? Math.min(notesLineBreaks, 12) : notesBaseRows

    //TODO fix invalid Autocomplete option, isOptionEqualToValue?

    return (
        <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

            <React.Fragment>

                {addLock &&
                    <EvidenceLockSearchBox handleChangeLock={handleChangeLock}/>
                }

                {(addProject || addAward) &&
                    <div style={{maxWidth: 630, marginBottom: 20, marginTop: 10}}>
                        <div style={{fontWeight: 600, marginBottom: 5}}>Select {fieldLabel}</div>
                        <Autocomplete
                            disablePortal
                            value={entryName}
                            options={entryValues}
                            style={{maxWidth: 400, marginBottom: 10, marginTop: 5}}
                            onInputChange={(_event, newInputValue) => {
                                if (entryValues.includes(newInputValue)) {
                                    setEntryName(newInputValue)
                                } else {
                                    setEntryName(null)
                                }
                                setUpdated(true)
                            }}
                            renderInput={(params) => <TextField {...params} label={fieldLabel} color='secondary'/>}
                        />
                    </div>
                }

                <div style={{display: 'flex', width: '95%', marginBottom: 10, minWidth: minWidth}}>
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
                        focused
                    />
                    <IconButton disabled={evidenceUrlError || !evidenceUrl}>
                        <a href={evidenceUrl} target='_blank' rel='noreferrer'>
                            <LaunchIcon style={{fontSize: 'large', color: evidenceLaunchColor}}/></a>
                    </IconButton>
                </div>

                <div style={{display: 'flex', width: '95%', marginBottom: 20}}>

                    <DatePicker
                        label='Date'
                        value={evidenceDate}
                        onChange={(newValue) => {
                            setEvidenceDate(newValue)
                            setUpdated(true)
                        }}
                        sx={{width: 250}}
                        disableFuture
                    />

                    {(!awardMode && !addProject && (blackBeltUser || admin)) &&
                        <React.Fragment>
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

                            <ViewPageDrawer pageId='danModifiers'/>

                        </React.Fragment>
                    }
                </div>

                <div style={{display: 'flex', width: '95%', marginBottom: 20}}>
                    <div style={{flexGrow: 1, width: '100%', marginRight: 15}}>
                        <TextField
                            id='entryNotes'
                            label='Your Notes (optional)'
                            value={entryNotes}
                            placeholder='Your Notes (optional)'
                            fullWidth multiline rows={notesRows}
                            size='small'
                            margin='dense'
                            color='secondary'
                            onChange={e => {
                                setEntryNotes(sanitizeValues(e.target.value, {urlsOK: true}))
                                setUpdated(true)
                            }}
                            sx={{input: {color: '#ddd'}}}
                        />
                        {entryNotes.length > 0 &&
                            <div style={{color: '#aaa', fontSize: '0.85rem', textAlign: 'right'}}>
                                {entryNotes.length || 0}/1200
                            </div>
                        }
                    </div>
                    {(!!entry && source !== 'collectionButton') &&
                        <div style={{width: buttonWidth, textAlign: 'right', marginTop: 10}}>
                            <CollectionButton id={activity?.matchId || lockId} dense={denseButton}/>
                        </div>
                    }
                </div>

                <div style={{display: 'flex'}}>
                    <div style={{marginLeft: 0}}>
                        {activity &&
                            <Button style={{marginRight: 10, color: '#d00'}} onClick={handleOpen} edge='start'
                                    disabled={!activity}>
                                Delete
                            </Button>
                        }
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
                        >
                            Cancel
                        </Button>
                        <Button style={{marginRight: 0, color: saveEntryColor}}
                                onClick={handleSave}
                                disabled={!updated || entryError || !entryId}
                        >
                            Save
                        </Button>
                    </div>
                </div>

            </React.Fragment>

        </LocalizationProvider>
    )
}
