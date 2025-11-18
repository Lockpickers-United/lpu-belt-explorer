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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import utc from 'dayjs/plugin/utc'
import {useNavigate} from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PrintIcon from '@mui/icons-material/Print'
import AppContext from '../app/AppContext.jsx'
import {blackBeltAwardId} from '../entries/entryutils'
import DataContext from '../context/DataContext.jsx'

dayjs.extend(utc)

function ScorecardRow({owner, activity, expanded, onExpand, merged}) {

    const navigate = useNavigate()
    const {setFilters} = useContext(FilterContext)
    const {cardActivity, getEntryFromId, getProjectEntryFromId, getAwardEntryFromId} = useContext(ScorecardDataContext)
    const {admin} = useContext(AppContext)
    const {blackBeltScorecard} = useContext(DataContext)

    const entry = getEntryFromId(activity.matchId)
    const project = getProjectEntryFromId(activity.matchId)
    const award = getAwardEntryFromId(activity.matchId)
    const entity = entry || project || award

    if (!entity) return

    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (expanded && ref && !scrolled) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === activity.id

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
    }, [expanded, entity, scrolled, activity.id])

    let entryTitle = entity ? entryName(entity) : activity.evidenceNotes
    const evidenceNotes = activity.exceptionType && activity.evidenceNotes && (activity.evidenceNotes.toLowerCase() !== entryTitle.toLowerCase())
        ? activity.evidenceNotes : null
    entryTitle = activity.exceptionType === 'nomatch' ? `[ ${activity.evidenceNotes} ]` : entryTitle
    entryTitle = activity.exceptionType && owner && merged && !award ? entryTitle + ' *' : entryTitle

    const rowOpacity = ['nomatch', 'duplicate', 'upgraded'].includes(activity.exceptionType) ? 0.5 : 1

    const supersedingEntryId = activity.exceptionId
    const supersedingEntry = supersedingEntryId ? cardActivity.find(e => e.id === supersedingEntryId) : {}
    const supersedingLock = supersedingEntry ? useMemo(() => getEntryFromId(supersedingEntry.matchId), [getEntryFromId, supersedingEntry.matchId]) : {}
    const supersedingProject = supersedingEntry ? useMemo(() => getProjectEntryFromId(supersedingEntry.matchId), [getProjectEntryFromId, supersedingEntry.matchId]) : {}
    const supersedingLockName = supersedingLock ? entryName(supersedingLock, 'short') : ''
    const supersedingLink = supersedingLock
        ? <Link style={{color: '#6dbbff'}} onClick={() => {
            navigateToEntry(supersedingEntryId)
        }}>{supersedingLockName}</Link>
        : supersedingProject?.name

    let exceptionNote = activity.exceptionType === 'nomatch'
        ? 'Could not be matched to a lock or project'
        : activity.exceptionType === 'badlink' && !award
            ? 'You must provide a valid link.'
            : activity.exceptionType === 'duplicate'
                ? 'Duplicate of '
                : activity.exceptionType === 'upgraded'
                    ? 'Upgraded to '
                    : null

    const navigateToEntry = useCallback((id) => {
        setFilters({id: id})
    }, [setFilters])

    const pointsText = activity.points === 1 ? 'pt' : 'pts'
    let dateText = activity.date ? dayjs(activity.date).format('L') : '(no date)'
    dateText = dateText.replace('/202', '/2')
    dateText = dateText.replace('/201', '/1')
    const dateColor = activity.date ? '#fff' : '#aaa'

    const isAward = ['belt', 'dan', 'hof'].includes(activity['awardType'])
    const expandable = (owner && !isAward) || admin

    const handleChange = useCallback((_, isExpanded) => {
        if (expandable) {
            onExpand(isExpanded ? activity.id : false)
        }
    }, [activity, expandable, onExpand])

    const handleClick = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        navigate('/award')
    }, [navigate])

    const cursorStyle = !expandable ? {cursor: 'default'} : {}
    const expandIcon = expandable ? <ExpandMoreIcon/> : <div style={{width:24}}/>

    const {isMobile} = useWindowSize()
    const flexType = !isMobile ? 'flex' : 'block'
    const infoDivStyle = !isMobile ? {display: 'flex', margin: '0px 0px 0px 20px'} : {
        display: 'block',
        marginLeft: 0,
        placeItems: 'center'
    }
    const nameDivWidth = !isMobile ? '56%' : '65%'
    const dateMargin = !isMobile ? '3px 0px 3px 0px' : '-2px 0px 3px 0px'

    const titleSize = isAward ? '1.1rem' : '1rem'
    const bgColor = isAward ? '#121212' : ''
    const iconColor = activity.name === 'Dan 20' ? 'ffff2c' : '#87c048'

    const style = {
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        placeItems: 'center',
        backgroundColor: bgColor
    }


    return (
        <Accordion key={activity.id} expanded={expanded} onChange={handleChange} ref={ref}>
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
                        {activity.awardType === 'belt' &&
                            <div style={{marginTop: -4, marginRight: 10}}><BeltIcon value={entity.belt}
                                                                                    style={{paddingTop: 2}}/></div>
                        }
                        {activity.awardType === 'dan' &&
                            <div style={{margin: '0px 12px 0px 5px'}}><SportsMartialArtsIcon
                                style={{color: iconColor}}/></div>
                        }
                        {activity.awardType === 'hof' &&
                            <div style={{margin: '0px 12px 0px 5px'}}><EmojiEventsIcon
                                style={{color: '#f8f52f'}}/></div>
                        }
                        <FieldValue
                            value={entryTitle}
                            textStyle={{marginLeft: '0px', fontWeight: 700, fontSize: titleSize}}
                            style={{marginBottom: '2px'}}
                        />
                    </div>
                    {!!evidenceNotes && !award &&
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

                    {(exceptionNote || (activity.evidenceModifier && (blackBeltScorecard||admin))) &&
                        <div style={{
                            margin: '0px 0px 0px 6px',
                            fontWeight: 600,
                            fontSize: '.95rem'
                        }}>
                            {activity.evidenceModifier && (blackBeltScorecard||admin) &&
                                <span style={{marginTop:10}}>* {activity.evidenceModifier}</span>
                            }
                            {exceptionNote &&
                                <span style={{marginLeft:10, fontSize: '.9rem'}}>* {exceptionNote} {supersedingLink}</span>
                            }
                        </div>
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
                            {(owner || !isAward) &&
                                <ScorecardEvidenceButton activity={activity} handleChange={handleChange}
                                                         exceptionType={activity.exceptionType} owner={owner}/>
                            }
                        </div>
                    </div>

                    <div style={infoDivStyle}>
                        <div
                            style={{margin: dateMargin, color: dateColor, width: 90, textAlign: 'center'}}>
                            {dateText}
                        </div>
                        {!['belt', 'dan'].includes(activity['awardType']) &&
                            <div
                                style={{margin: '1px 0px 0px 22px'}}>
                                <nobr><span style={{fontWeight: 700}}>{activity.points} </span><span
                                    style={{color: '#666'}}>{pointsText}</span></nobr>
                            </div>
                        }
                        {owner && activity['matchId'] === blackBeltAwardId &&
                            <Tooltip title='Print Certificate' arrow disableFocusListener>
                                <IconButton onClick={handleClick} style={{marginLeft: 30}}>
                                    <PrintIcon/>
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                </div>


            </AccordionSummary>
            {owner && expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '4px 16px 0px 26px'}}>
                        <EvidenceForm activity={activity} handleUpdate={() => {
                        }}/>
                    </AccordionDetails>
                </React.Fragment>
            }
        </Accordion>
    )

}

export default React.memo(ScorecardRow, (prevProps, nextProps) => {
    const prevActKeys = Object.keys(prevProps.activity)
    const nextActKeys = Object.keys(nextProps.activity)

    if (prevActKeys.length !== nextActKeys.length) {
        return false
    }
    for (let idx = 0; idx < prevActKeys.length; idx++) {
        if (prevActKeys[idx] !== nextActKeys[idx] || prevProps.activity[prevActKeys[idx]] !== nextProps.activity[nextActKeys[idx]]) {
            return false
        }
    }
    return prevProps.owner === nextProps.owner &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand &&
        prevProps.merged === nextProps.merged
})
