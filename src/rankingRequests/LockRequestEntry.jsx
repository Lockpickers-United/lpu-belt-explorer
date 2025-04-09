import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import FieldValue from '../entries/FieldValue.jsx'
import LockImageGallery from '../entries/LockImageGallery.jsx'
import ListItemText from '@mui/material/ListItemText'
import entryName from '../entries/entryName'
import useWindowSize from '../util/useWindowSize.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import DataContext from '../context/DataContext.jsx'
import queryString from 'query-string'
import CopyLinkToRequestButton from './CopyLinkToRequestButton.jsx'
import EditRequestButton from './EditRequestButton.jsx'
import AccordionActions from '@mui/material/AccordionActions'
import RequestStatusSelect from './RequestStatusSelect.jsx'
import BeltStripe from '../entries/BeltStripe.jsx'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import {enqueueSnackbar} from 'notistack'
import DBContext from '../app/DBContext.jsx'
import TextField from '@mui/material/TextField'

/**
 * @typedef {object} entry
 * @typedef {object} usernames
 * @prop usernames.reddit
 * @prop usernames.discord
 * @prop entry.dateRequested
 * @prop approximateBelt
 * @prop userBelt
 * @prop hazLocc
 */

export default function LockRequestEntry({entry, expanded, onExpand, requestMod}) {
    const {updateRankingRequest} = useContext(DBContext)
    const ref = useRef(null)
    const {expandAll} = useContext(DataContext)
    const [scrolled, setScrolled] = useState(false)
    const [showEditRequest, setShowEditRequest] = useState(false)
    const [form, setForm] = useState(
        {
            make: entry.makeModels ? entry.makeModels[0].make : '',
            model: entry.makeModels ? entry.makeModels[0].model : '',
            belt: entry.belt
        }
    )

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? entry.id : false)
    }, [entry.id, onExpand])

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
    }, [form])

    const handleEditRequest = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        setShowEditRequest(true)
    }, [setShowEditRequest])

    const handleEditClose = useCallback(() => {
        setForm({
            make: entry.makeModels ? entry.makeModels[0].make : '',
            model: entry.makeModels ? entry.makeModels[0].model : '',
            belt: entry.belt
        })
        setShowEditRequest(false)
    }, [entry.belt, entry.makeModels])

    const handleSnackbar = useCallback((response) => {
        if (response.success) {
            enqueueSnackbar('Request updated')
        } else {
            enqueueSnackbar(`Error updating request: ${response.message}`, {variant: 'error'})
        }
    }, [])

    const handleEdit = useCallback(async () => {
        const updatedEntry = {
            ...entry.originalEntry,
            makeModels: [{make: form.make, model: form.model}],
            requestStatus: form.requestStatus || entry.requestStatus,
            belt: form.belt || entry.belt,
            lastUpdated: dayjs().toISOString()
        }
        if (!['Ranked', 'Completed'].includes(updatedEntry.requestStatus)) {
            delete updatedEntry.belt
        }
        await updateRankingRequest(updatedEntry)
            .then(response => handleSnackbar(response))
        setShowEditRequest(false)
    }, [entry, form, handleSnackbar, updateRankingRequest])

    useEffect(() => {
        if (expanded && ref && !scrolled && !expandAll) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === entry.id

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
    }, [expanded, entry, scrolled, expandAll])

    const discordUsername = entry.usernames.discord ? entry.usernames.discord : undefined
    const redditUsername = entry.usernames.reddit ? `u/${entry.usernames.reddit.replace(/^\/*u\//, '')}` : undefined
    const userName = discordUsername || redditUsername || undefined
    const userBelt = entry.userBelt ? ` (${entry.userBelt})` : ''
    const rankedBelt = entry.belt && entry.belt !== 'Unranked' ? ` (${entry.belt})` : ''

    const formError = (!form.make || form.model.length < 1
        || form.requestStatus === 'Ranked' && !form.belt
    )

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const {flexStyle} = useWindowSize()

    const opacity = entry.requestStatus === 'Declined' ? 0.5 : 1

    return (
        <React.Fragment>
            <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                                  style={{cursor: 'pointer'}}>
                    <BeltStripe value={entry.belt}/>
                    <div style={{display: flexStyle, width: '100%', alignItems: 'center', opacity: opacity}}>
                        <ListItemText
                            primary={entryName(entry)}
                            primaryTypographyProps={{fontWeight: 500, fontSize: '1.1rem'}}
                            secondary={entry.lockingMechanisms.join(', ')}
                            secondaryTypographyProps={{fontSize: '0.9rem'}}
                            style={{padding: '0px 0px 0px 10px'}}
                        />
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'right', marginRight: 20}}>
                            {entry.requestStatus}{rankedBelt} &nbsp;
                            <EditRequestButton handleClick={handleEditRequest} requestMod={requestMod}/>
                        </div>
                    </div>
                </AccordionSummary>
                {
                    expanded &&
                    <AccordionDetails sx={{padding: '0px 16px 0px 16px'}}>

                        <div style={{display: flexStyle, width: '100%'}}>

                            {
                                !!entry.notes?.length &&
                                <FieldValue name='Notes' value={entry.notes} style={{marginRight: 20}}/>
                            }
                            <div
                                style={{display: flexStyle, flexGrow: 1, justifyContent: 'right', marginRight: 15}}>
                                <FieldValue name='Requested By' value={userName + userBelt}
                                            style={{minWidth: 100}}/>
                            </div>
                        </div>

                        <div style={{display: flexStyle, width: '100%'}}>
                            {
                                !!entry.approximateBelt &&
                                <FieldValue name='Suggested Belt' value={`${entry.approximateBelt} Belt`}
                                            style={{marginRight: 10}}/>
                            }
                            {
                                !!entry.hazLocc &&
                                <FieldValue name='Has Lock(s)' value={entry.hazLocc} style={{marginRight: 10}}/>
                            }
                        </div>
                        {
                            !!entry.media?.length &&
                            <div style={{marginLeft: 6}}>
                                <LockImageGallery entry={entry}/>
                            </div>
                        }
                        <AccordionActions>
                            <CopyLinkToRequestButton entry={entry}/>
                        </AccordionActions>
                    </AccordionDetails>
                }
            </Accordion>

            <Dialog open={showEditRequest} onClose={handleEditClose} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
            }}>
                <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 30}}>
                    <div style={{fontSize: '1.3rem', fontWeight: 500, marginBottom: 20, textAlign: 'center'}}>
                        Edit Request<br/>
                    </div>

                    <div style={{marginTop: 0}}>
                        <RequestStatusSelect entry={entry} requestMod={requestMod} form={form} setForm={setForm}
                                             setShowEditRequest={setShowEditRequest}/>
                    </div>

                    <div style={{marginTop: 10}}>
                        <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>Brand</div>
                        <TextField type='text' name='make' size='small' style={{width: 200}} color='info'
                                   onChange={handleFormChange} value={form.make || ''}
                                   error={form.make.length === 0}/>
                    </div>

                    <div style={{marginTop: 10}}>
                        <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>Model Name</div>
                        <TextField type='text' name='model' size='small' style={{width: 200}} color='info'
                                   onChange={handleFormChange} value={form.model || ''}
                                   error={form.model.length === 0}/>
                    </div>

                    <div style={{width: '100%', textAlign: 'center', marginTop: 20}}>
                        <Button onClick={handleEditClose} variant='contained' color='success'
                                style={{marginRight: 20, backgroundColor: '#999'}}>
                            CANCEL
                        </Button>
                        <Button onClick={handleEdit} variant='contained' color='success' disabled={formError}>
                            SAVE
                        </Button>
                    </div>
                </div>
            </Dialog>

        </React.Fragment>
    )
}

//export default React.memo(LockRequestEntry)