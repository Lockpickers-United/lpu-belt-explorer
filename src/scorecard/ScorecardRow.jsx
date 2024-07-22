import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import BeltStripe from '../entries/BeltStripe.jsx'
import FieldValue from '../entries/FieldValue.jsx'

import dayjs from 'dayjs'
import AccordionDetails from '@mui/material/AccordionDetails'
import ScorecardEvidenceButton from './ScorecardEvidenceButton.jsx'
import entryName from '../entries/entryName'
import ViewLockButton from './ViewLockButton.jsx'
import queryString from 'query-string'
import ScorecardDataContext from './ScorecardDataProvider.jsx'
import FilterContext from '../context/FilterContext.jsx'
import Link from '@mui/material/Link'
import EvidenceForm from './EvidenceForm.jsx'

import useWindowSize from '../util/useWindowSize.jsx'

function ScorecardRow({owner, evid, expanded, onExpand}) {
    const {setFilters} = useContext(FilterContext)
    const {cardEvidence, getEntryFromId, getProjectEntryFromId} = useContext(ScorecardDataContext)

    //console.log('ScorecardRow')

    let entry = useMemo(() => {
        let match = getEntryFromId(evid.matchId)
        match = match
            ? match
            : getProjectEntryFromId(evid.matchId)
        return match
    }, [getEntryFromId, evid.matchId, getProjectEntryFromId])

    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)

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

    let entryTitle = entry
        ? entryName(entry)
        :  evid.notes
    const evidenceNotes = evid.exceptionType && (evid.notes.toLowerCase() !== entryTitle.toLowerCase())
        ? evid.notes
        : null
    entryTitle = evid.exceptionType === 'nomatch' ? `[ ${evid.notes} ]` : entryTitle
    entryTitle = evid.exceptionType ? entryTitle + ' *' : entryTitle

    const rowOpacity = ['nomatch', 'duplicate', 'upgraded'].includes(evid.exceptionType) ? 0.5 : 1

    const supersedingEntryId = evid.exceptionId
    const supersedingEntry = supersedingEntryId ? cardEvidence.find(e => e.id === supersedingEntryId) : {}
    const supersedingLock = supersedingEntry ? useMemo(() => getEntryFromId(supersedingEntry.matchId), [getEntryFromId, supersedingEntry.matchId]) : {}
    const supersedingLockName = supersedingLock ? entryName(supersedingLock, 'short') : ''
    const supersedingLink = supersedingEntryId
        ? <Link style={{color: '#99c2e5'}} onClick={() => {
            navigateToEntry(supersedingEntryId)
        }}>{supersedingLockName}</Link>
        : null
    let exceptionNote = evid.exceptionType === 'nomatch'
        ? 'Could not be matched to a lock or project'
        : evid.exceptionType === 'badlink'
            ? 'You must provide a valid link.'
            : evid.exceptionType === 'duplicate'
                ? 'Duplicate of '
                : evid.exceptionType === 'upgraded'
                    ? 'Upgraded to '
                    : null

    const navigateToEntry = useCallback((id) => {
        setFilters({id: id})
    }, [setFilters])

    const pointsText = evid.points === 1 ? 'pt' : 'pts'
    const dateText = evid.date ? dayjs(evid.date).format('MM/DD/YY') : '(no date)'

    const handleChange = useCallback((_, isExpanded) => {
        if (owner) {
            onExpand && onExpand(isExpanded ? evid.id : false)
        }
    }, [evid.id, onExpand, owner])

    const cursorStyle = !owner ? {cursor: 'default'} : {}
    const expandIcon = owner ? <ExpandMoreIcon/> : null

    const {isMobile} = useWindowSize()
    const flexType = !isMobile ? 'flex' : 'block'
    const infoDivStyle = !isMobile ? {display: 'flex', margin: '0px 0px 0px 20px'} : {
        display: 'block',
        marginLeft: 0,
        placeItems: 'center'
    }
    const nameDivWidth = !isMobile ? '58%' : '70%'

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', display: 'flex', placeItems: 'center'}

    return (
        <Accordion key={evid.id} expanded={expanded} onChange={handleChange} ref={ref}>
            <AccordionSummary expandIcon={expandIcon} style={{...style, ...cursorStyle}}>
                <BeltStripe value={entry ? entry.belt : ''}/>
                <div style={{
                    margin: '12px 0px 0px 8px',
                    width: nameDivWidth,
                    flexShrink: 0,
                    flexDirection: 'column',
                    opacity: rowOpacity
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

                <div style={{display: flexType, placeItems: 'center', marginLeft: 10, opacity: rowOpacity}}>

                    <div style={{display: 'flex', width: 76}}>
                        <div style={{margin: '2px 0px 0px 0px', width: 30, flexShrink: 0, flexDirection: 'column'}}>
                            {entry &&
                                <ViewLockButton entry={entry}/>
                            }
                        </div>
                        <div style={{margin: '0px 0px 0px 6px', flexShrink: 0, flexDirection: 'column'}}>
                            <ScorecardEvidenceButton url={evid.link} handleChange={handleChange}
                                                     exceptionType={evid.exceptionType}/>
                        </div>
                    </div>

                    <div style={infoDivStyle}>
                        <div
                            style={{margin: '0px 0px 0px 0px'}}>
                            {dateText}
                        </div>
                        <div
                            style={{margin: '0px 0px 0px 20px'}}>
                            <nobr><span style={{fontWeight: 700}}>{evid.points} </span><span
                                style={{color: '#666'}}>{pointsText}</span></nobr>
                        </div>
                    </div>

                </div>

            </AccordionSummary>
            {expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '4px 16px 0px 26px'}}>

                        {(exceptionNote || evid.modifier) &&
                            <div style={{
                                margin: '0px 0px 20px 20px',
                                fontWeight: 600,
                                fontSize: '.95rem'
                            }}>
                                {evid.modifier &&
                                    <span>{evid.modifier}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                }
                                {exceptionNote &&
                                    <span>* {exceptionNote} {supersedingLink}</span>
                                }
                            </div>
                        }

                        <EvidenceForm evid={evid} handleUpdate={() => {
                        }}/>

                    </AccordionDetails>
                </React.Fragment>
            }
        </Accordion>
    )

}

export default React.memo(ScorecardRow, (prevProps, nextProps) => {
    const prevEvidKeys = Object.keys(prevProps.evid)
    const nextEvidKeys = Object.keys(nextProps.evid)

    if (prevEvidKeys.length !== nextEvidKeys.length) {
        return false
    }
    for (let idx=0; idx < prevEvidKeys.length; idx++) {
        if (prevProps.evid[idx] !== nextProps.evid[idx]) {
            return false
        }
    }

    if (prevProps.owner === nextProps.owner &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand) {
        return true
    } else {
        return false
    }
})
