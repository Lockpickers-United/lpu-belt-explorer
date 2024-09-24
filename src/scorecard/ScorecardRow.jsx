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
import Typography from '@mui/material/Typography'
import BeltIcon from '../entries/BeltIcon.jsx'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import utc from 'dayjs/plugin/utc'
import {useNavigate} from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PrintIcon from '@mui/icons-material/Print'
dayjs.extend(utc)

function ScorecardRow({owner, evid, expanded, onExpand, merged}) {
    const navigate = useNavigate()
    const {setFilters} = useContext(FilterContext)
    const {cardEvidence, getEntryFromId, getProjectEntryFromId, getAwardEntryFromId} = useContext(ScorecardDataContext)

    const entry = getEntryFromId(evid.matchId)
    const project = getProjectEntryFromId(evid.matchId)
    const award = getAwardEntryFromId(evid.matchId)
    const entity = entry
        ? entry
        : project
            ? project
            : award

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
    }, [expanded, entity, scrolled, evid.id])

    let entryTitle = entity
        ? entryName(entity)
        : evid.evidenceNotes
    const evidenceNotes = evid.exceptionType && (evid.evidenceNotes.toLowerCase() !== entryTitle.toLowerCase())
        ? evid.evidenceNotes
        : null
    entryTitle = evid.exceptionType === 'nomatch' ? `[ ${evid.evidenceNotes} ]` : entryTitle
    entryTitle = evid.exceptionType && owner && merged ? entryTitle + ' *' : entryTitle

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
    let dateText = evid.date ? dayjs(evid.date).format('L') : '(no date)'
    dateText = dateText.replace('/202', '/2')
    dateText = dateText.replace('/201', '/1')
    const dateColor = evid.date ? '#fff' : '#aaa'

    const expandable = owner && !['belt', 'dan'].includes(evid['awardType'])
    const handleChange = useCallback((_, isExpanded) => {
        if (expandable) {
            onExpand(isExpanded ? evid.id : false)
        }
    }, [evid.id, expandable, onExpand])

    const handleClick = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        navigate('/award')
    }, [navigate])

    const cursorStyle = !expandable ? {cursor: 'default'} : {}
    const expandIcon = expandable ? <ExpandMoreIcon/> : null

    const {isMobile} = useWindowSize()
    const flexType = !isMobile ? 'flex' : 'block'
    const infoDivStyle = !isMobile ? {display: 'flex', margin: '0px 0px 0px 20px'} : {
        display: 'block',
        marginLeft: 0,
        placeItems: 'center'
    }
    const nameDivWidth = !isMobile ? '56%' : '65%'
    const dateMargin = !isMobile ? '3px 0px 3px 0px' : '-2px 0px 3px 0px'

    const titleSize = ['belt', 'dan'].includes(evid['awardType']) ? '1.1rem' : '1rem'
    const bgColor = ['belt', 'dan'].includes(evid['awardType']) ? '#121212' : ''

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', display: 'flex', placeItems: 'center', backgroundColor:bgColor}


    return (
        <Accordion key={evid.id} expanded={expanded} onChange={handleChange} ref={ref}>
            <AccordionSummary expandIcon={expandIcon} style={{...style, ...cursorStyle}}>
                <BeltStripe value={entity ? entity.belt : ''}/>
                <div style={{
                    margin: '8px 0px 0px 8px',
                    width: nameDivWidth,
                    flexShrink: 0,
                    flexDirection: 'column',
                    opacity: rowOpacity
                }}>
                    <div style={{display: 'flex'}}>
                        {evid.awardType === 'belt' &&
                            <div style={{marginTop: -4, marginRight:10}}><BeltIcon value={entity.belt} style={{paddingTop: 2}}/></div>
                        }
                        {evid.awardType === 'dan' &&
                            <div style={{margin:'0px 12px 0px 5px'}}><SportsMartialArtsIcon style={{color:'#87c048'}}/></div>
                        }
                        <FieldValue
                            value={entryTitle}
                            textStyle={{marginLeft: '0px', fontWeight: 700, fontSize: titleSize}}
                            style={{marginBottom: '2px'}}
                        />
                    </div>
                    {!!evidenceNotes &&
                        <span style={{
                            margin: '0px 0px 0px 15px',

                            fontSize: '0.95rem',
                            lineHeight: 1.25,
                            color: '#bbb'
                        }}>{evidenceNotes}</span>
                    }
                    {!!entity && !!entity?.version &&
                        <FieldValue
                            name='Version'
                            value={<Typography
                                style={{fontSize: '0.95rem', lineHeight: 1.25}}>{entity?.version}</Typography>}
                            textStyle={entity?.belt === 'Unranked' ? {color: '#aaa'} : {}}
                        />
                    }
                </div>


                <div style={{display: flexType, placeItems: 'center', marginLeft: 10, opacity: rowOpacity}}>

                    <div style={{display: 'flex', width: 76}}>
                        <div style={{margin: '2px 0px 0px 6px', width: 30, flexShrink: 0, flexDirection: 'column'}}>
                            {entry &&
                                <ViewLockButton entry={entry}/>
                            }
                        </div>
                        <div style={{margin: '0px 0px 0px 6px', flexShrink: 0, flexDirection: 'column'}}>
                            <ScorecardEvidenceButton url={evid.link} handleChange={handleChange}
                                                     exceptionType={evid.exceptionType} owner={owner}/>
                        </div>
                    </div>

                    <div style={infoDivStyle}>
                        <div
                            style={{margin: dateMargin, color: dateColor, width: 90, textAlign: 'center'}}>
                            {dateText}
                        </div>
                        {!['belt', 'dan'].includes(evid['awardType']) &&
                            <div
                                style={{margin: '1px 0px 0px 22px'}}>
                                <nobr><span style={{fontWeight: 700}}>{evid.points} </span><span
                                    style={{color: '#666'}}>{pointsText}</span></nobr>
                            </div>
                        }
                        {owner && evid['matchId'] === 'da7759a9' &&
                            <Tooltip title='Print Certificate' arrow disableFocusListener>
                                <IconButton onClick={handleClick} style={{marginLeft: 30}}>
                                    <PrintIcon/>
                                </IconButton>
                            </Tooltip>
                        }
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
    for (let idx = 0; idx < prevEvidKeys.length; idx++) {
        if (prevEvidKeys[idx] !== nextEvidKeys[idx] || prevProps.evid[prevEvidKeys[idx]] !== nextProps.evid[nextEvidKeys[idx]]) {
            return false
        }
    }
    return prevProps.owner === nextProps.owner &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand &&
        prevProps.merged === nextProps.merged
})
