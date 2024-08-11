import React, {useState, useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ScorecardDataContext from './ScorecardDataProvider'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import entryName from '../entries/entryName'
import Link from '@mui/material/Link'
import FilterContext from '../context/FilterContext.jsx'
import Drawer from '@mui/material/Drawer'

function ScoringExceptions() {
    const {setFilters} = useContext(FilterContext)
    const {cardEvidence, getEntryFromId} = useContext(ScorecardDataContext)

    const [overlayIsOpen, setOverlayIsOpen] = useState(false)
    const handleOverlayOpen = useCallback(() => {
        setOverlayIsOpen(true)
    }, [])

    const handleOverlayClose = useCallback(() => {
        setOverlayIsOpen(false)
    }, [])

    const navigateToEntry = useCallback((id) => {
        setFilters({id: id})
        setOverlayIsOpen(false)
    }, [setFilters])

    const annotatedEvidence = cardEvidence.map(evid => {
        const supersedingEntryId = evid.exceptionId
        const supersedingEntry = supersedingEntryId ? cardEvidence.find(e => e.id === supersedingEntryId) : {}
        const supersedingLock = supersedingEntry ? getEntryFromId(supersedingEntry.matchId) : {}
        const supersedingLockName = supersedingLock ? entryName(supersedingLock, 'short') : ''
        const matchLock = evid.matchId ? getEntryFromId(evid.matchId) : null
        const matchLockName = matchLock ? entryName(matchLock, 'short') : ''
        return {...evid, supersedingEntryId: supersedingEntryId, supersedingLockName: supersedingLockName, matchLockName:matchLockName}
    })

    const unmatchedEvid = annotatedEvidence.filter(ev => 'nomatch' === ev.exceptionType)
    const badlinkEvid = annotatedEvidence.filter(ev => 'badlink' === ev.exceptionType)
    const samelinedEvid = annotatedEvidence.filter(ev => 'duplicate' === ev.exceptionType)
    const supersededEvid = annotatedEvidence.filter(ev => 'upgraded' === ev.exceptionType)
    const totalNum = unmatchedEvid.length + badlinkEvid.length + samelinedEvid.length + supersededEvid.length

    if (totalNum > 0) {
        return (
            <React.Fragment>
                <IconButton onClick={handleOverlayOpen} style={{marginRight:5}}>
                    <HelpOutlineIcon fontSize='small'/>
                </IconButton>
                <Drawer
                    sx={{color: '#fff', textAlign: 'left', height: 700, zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={overlayIsOpen} onClick={handleOverlayClose}
                >
                    <div style={{maxWidth: 600, fontSize: '0.95rem', padding: 15}}>

                        <div style={{display: 'flex', marginBottom: 10, placeItems: 'center'}}>
                            <div style={{fontWeight: 600, fontSize: '1.3rem', flexGrow: 1}}>
                                Some documentation ineligible for Dan Points
                            </div>
                            <IconButton onClick={handleOverlayClose}>
                                <HighlightOffIcon sx={{cursor: 'pointer'}}/>
                            </IconButton>
                        </div>

                        <div style={{marginBottom: 20}}>
                            Some of the entries in your Scorecard are not eligible for Dan Points.
                            Reasons for this may include:
                            the link in your documentation is missing or not valid,
                            we could not find a lock matching your entry,
                            you have multiple entries for the same lock,
                            or an entry may have been replaced by an upgrade of the same lock.
                            Locks ranked below Blue Belt are never eligible for Dan Points.
                        </div>
                        {unmatchedEvid.length > 0 &&
                            <React.Fragment>
                                <Divider style={{marginBottom: 20}}/>
                                <Typography
                                    style={{
                                        fontWeight: 500, fontSize: '1.0rem', lineHeight: '1.25rem', margin: '0px'
                                    }}>
                                    Could not be matched to a lock or project
                                </Typography>
                                <ul style={{padding: 0, marginLeft: 20}}>
                                    {unmatchedEvid.map((ev, index) =>
                                        <li key={index} style={{marginBottom: 4}}>
                                            <Link style={{color: '#99c2e5', textDecoration: 'none'}} onClick={() => {
                                                navigateToEntry(ev.id)
                                            }}>{ev.evidenceNotes}</Link>
                                        </li>
                                    )}
                                </ul>
                            </React.Fragment>
                        }

                        {badlinkEvid.length > 0 &&
                            <React.Fragment>
                                <Typography
                                    style={{
                                        fontWeight: 500, fontSize: '1.0rem', lineHeight: '1.25rem', margin: '0px'
                                    }}>
                                    Missing or invalid URLs
                                </Typography>
                                <ul style={{padding: 0, marginLeft: 20}}>
                                    {badlinkEvid.map((ev, index) =>
                                        <li key={index} style={{marginBottom: 4}}>
                                            <Link style={{color: '#99c2e5', textDecoration: 'none'}} onClick={() => {
                                                navigateToEntry(ev.id)
                                            }}>{ev.matchLockName}</Link>
                                        </li>
                                    )}
                                </ul>
                            </React.Fragment>
                        }

                        {samelinedEvid.length > 0 &&
                            <React.Fragment>
                                <Typography
                                    style={{
                                        fontWeight: 500, fontSize: '1.0rem', lineHeight: '1.25rem', margin: '0px'
                                    }}>
                                    Duplicated by another entry
                                </Typography>
                                <ul style={{padding: 0, marginLeft: 20}}>
                                    {samelinedEvid.map((ev, index) =>
                                        <li key={index} style={{marginBottom: 4}}>
                                            {ev.evidenceNotes} is a duplicate
                                            of <Link style={{color: '#99c2e5', textDecoration: 'none'}} onClick={() => {
                                            navigateToEntry(ev.supersedingEntryId)
                                        }}>{ev.supersedingLockName}</Link>
                                        </li>
                                    )}
                                </ul>
                            </React.Fragment>
                        }

                        {supersededEvid.length > 0 &&
                            <React.Fragment>
                                <Typography
                                    style={{
                                        fontWeight: 500, fontSize: '1.0rem', lineHeight: '1.25rem', margin: '0px'
                                    }}>
                                    Upgraded by another lock
                                </Typography>
                                <ul style={{padding: 0, marginLeft: 20}}>
                                    {supersededEvid.map((ev, index) =>
                                        <li key={index} style={{marginBottom: 4}}>
                                            {ev.evidenceNotes} is upgraded by <Link
                                            style={{color: '#99c2e5', textDecoration: 'none'}} onClick={() => {
                                            navigateToEntry(ev.supersedingEntryId)
                                        }}>{ev.supersedingLockName}</Link>
                                        </li>
                                    )}
                                </ul>

                            </React.Fragment>
                        }
                    </div>
                </Drawer>
            </React.Fragment>
        )
    }
}

export default ScoringExceptions