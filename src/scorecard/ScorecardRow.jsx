import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import BeltStripe from '../entries/BeltStripe.jsx'
import FieldValue from '../entries/FieldValue.jsx'

import dayjs from 'dayjs'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'

import DataContext from '../locks/LockDataProvider.jsx'
import AccordionDetails from '@mui/material/AccordionDetails'
import ScorecardEvidenceButton from './ScorecardEvidenceButton.jsx'
import entryName from '../entries/entryName'
import ViewLockButton from './ViewLockButton.jsx'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import queryString from 'query-string'

export default function ScorecardRow({owner, evid, onSave, onDelete, allEntriesById, allProjectsById, expanded, onExpand, }) {

    console.log('ScorecardRow', evid)

    const eDate = dayjs(evid.date)
    const [lockProjectId, setLockProjectId] = useState(evid.matchId)
    const [evidenceName, setEvidenceName] = useState(evid.name)
    const [evidenceUrl, setEvidenceUrl] = useState(evid.link)
    const [evidenceUrlErr, setEvidenceUrlErr] = useState(null)
    const [evidenceDate, setEvidenceDate] = useState(eDate)
    const [evidenceDateErr, setEvidenceDateErr] = useState(null)
    const [modifier, setModifier] = useState(evid.modifier)
    const [updated, setUpdated] = useState(false)

    const {getEntryFromId} = useContext(DataContext)
    const entry = useMemo(() => getEntryFromId(evid.matchId), [getEntryFromId, evid])
    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)

    const handleChange = useCallback((_, isExpanded) => {
        if (owner) {
            onExpand && onExpand(isExpanded ? evid.id : false)
        }
    }, [evid.id, onExpand, owner])

    useEffect(() => {
        if (expanded && ref && !scrolled) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === evid.id

            setScrolled(true)

            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: ref.current.offsetTop - offset,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        } else if (!expanded) {
            setScrolled(false)
        }
    }, [expanded, entry, scrolled, evid.id])

    let entryTitle = entry ? entryName(entry) : `[ ${evid.name} ]`
    entryTitle = evid.note ? entryTitle + ' *' : entryTitle
    const evidenceNotes = evid.name && (evid.name.toLowerCase() !== entryTitle.toLowerCase()) ? evid.name : null
    const pointsText = evid.points === 1 ? 'pt' : 'pts'

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const handleSave = useCallback( async () => {
        onSave(evid.id, lockProjectId, evidenceName, evidenceUrl, evidenceDate, modifier)
        setUpdated(false)
    }, [evid.id, evidenceDate, evidenceName, evidenceUrl, lockProjectId, modifier, onSave])

    const cancelEdit = useCallback(() => {
        if (updated) {
            setEvidenceUrl(evid.link)
            setUpdated(false)
            setEvidenceName(evid.name)
        }
    }, [evid.link, evid.name, updated])

    const handleDelete = useCallback(() => {
        console.log('handleDelete')
        onDelete(evid.id)
    }, [evid.id, onDelete])

    const processURL = useCallback(event => {
        const {value} = event.target
        setEvidenceUrl(value)
        setUpdated(true)
    }, [])

    const evidenceUrlValid = isValidHttpUrl(evidenceUrl)
    const evidenceUrlError = !!evidenceUrl && !isValidHttpUrl(evidenceUrl)
    const evidenceURLHelperText = evidenceUrlError ? 'Video URL is not valid' : ''
    const evidenceLaunchColor = evidenceUrlValid ? '#fff' : '#666'
    const saveEntryColor = updated && !evidenceUrlError ? '#fff' : '#555'
    const cancelColor = updated ? '#e15c07' : '#555'

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', display: 'flex', placeItems: 'center'}

    const cursorStyle = !owner ? {cursor: 'default'} : {}
    const expandIcon = owner ? <ExpandMoreIcon/> : null

    return (
        <Accordion key={evid.id} expanded={expanded} onChange={handleChange}  ref={ref}>
            <AccordionSummary expandIcon={expandIcon} style={{...style, ...cursorStyle}}>
                <BeltStripe value={entry ? entry.belt : ''}/>
                <div style={{
                    margin: '12px 0px 0px 8px',
                    width: '60%',
                    flexShrink: 0,
                    flexDirection: 'column'
                }}>
                    <FieldValue
                        value={entryTitle}
                        textStyle={{marginLeft: '0px', fontWeight: 700}}
                        style={{marginBottom: '2px'}}
                    />
                    {!!evidenceNotes &&
                        <span style={{
                            marginLeft: 15,
                            fontSize: '0.95rem',
                            lineHeight: 1.25,
                            color: '#bbb'
                        }}>{evidenceNotes}</span>}
                </div>

                <div style={{margin: '8px 0px 0px 0px', width: 30, flexShrink: 0, flexDirection: 'column'}}>
                    {entry &&
                        <ViewLockButton entry={entry}/>
                    }
                </div>

                <div style={{margin: '6px 0px 0px 6px', flexShrink: 0, flexDirection: 'column'}}>
                    <ScorecardEvidenceButton url={evid.link}/>
                </div>

                <div style={{margin: '14px 0px 0px 20px', width: '10%', flexShrink: 0, flexDirection: 'column'}}>
                    {dayjs(evid.date).format('MM/DD/YY')}
                </div>

                <div style={{margin: '14px 0px 0px 35px', width: '10%', flexShrink: 0, flexDirection: 'column'}}>
                    <span style={{fontWeight: 700}}>{evid.points}</span> <span
                    style={{color: '#666'}}>{pointsText}</span>
                </div>


            </AccordionSummary>
            {expanded &&
            <React.Fragment>
                <AccordionDetails sx={{padding: '4px 16px 0px 26px'}}>
                    {(evid.note || evid.modifier) &&
                        <div style={{
                            margin: '0px 0px 20px 20px',
                            fontWeight: 600,
                            fontSize: '.95rem'
                        }}>
                            {evid.modifier &&
                                <span>{evid.modifier}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            }
                            {evid.note &&
                                <span>* {evid.note}</span>
                            }
                        </div>
                    }

                    <div style={{display: 'flex', width: '95%', marginBottom: 10}}>
                        <TextField
                            id='evidence-url'
                            error={!!evidenceUrlErr}
                            helperText={evidenceURLHelperText}
                            label='Documentation Link'
                            value={evidenceUrl}
                            placeholder='https://youtu.be/'
                            fullWidth
                            size='small'
                            margin='dense'
                            color='secondary'
                            onChange={processURL}
                        />
                        <IconButton disabled={false}>
                            <a href={evidenceUrl} target='_blank' rel='noreferrer'>
                                <LaunchIcon style={{fontSize: 'large', color: evidenceLaunchColor}}/></a>
                        </IconButton>
                    </div>

                    <div style={{display: 'flex', width: '100%', marginBottom: 20}}>

                        <DatePicker
                            label='Pick date'
                            value={evidenceDate}
                            onChange={(newValue) => {
                                setEvidenceDateErr(null)
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
                            <MenuItem value='First Recorded Defeat (Notable)'>First Recorded Defeat (Notable)</MenuItem>
                        </TextField>

                    </div>


                    <div style={{display: 'flex', width: '95%', marginBottom: 20}}>
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
                                    disabled={!updated}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </AccordionDetails>
            </React.Fragment>
            }
        </Accordion>
    )

}

function isValidHttpUrl(string) {
    let url
    try {
        url = new URL(string)
    } catch (_) {
        return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
}
