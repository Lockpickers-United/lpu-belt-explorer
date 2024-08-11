import React, {useState, useMemo, useContext, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import Button from '@mui/material/Button'
import DBContext from '../app/DBContext.jsx'
import AppContext from '../app/AppContext'
import ScorecardRow from './ScorecardRow.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
import ScorecardListContext from './ScorecardListContext'
import FilterContext from '../context/FilterContext'
import InlineScorecardCharts from './InlineScorecardCharts'
import ScorecardDanStats from './ScorecardDanStats.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ImportDanSheetForm from './ImportDanSheetForm.jsx'
import EvidenceForm from './EvidenceForm.jsx'
import Menu from '@mui/material/Menu'
import ProfileHeader from '../profile/ProfileHeader.jsx'
import BlackBeltAwardRow from './BlackBeltAwardRow'
import NoScorecardData from './NoScorecardData.jsx'


function Scorecard({owner, profile}) {
    const {isMobile} = useWindowSize()
    const {userId} = useParams()

    const {visibleEntries = [], cardEvidence} = useContext(ScorecardDataContext)
    const {expanded} = useContext(ScorecardListContext)
    const {filters, removeFilters} = useContext(FilterContext)
    const {createEvidenceForEntries, removeEvidence, removeProfileBlackBeltAwarded} = useContext(DBContext)
    const {admin} = useContext(AppContext)

    const [entryExpanded, setEntryExpanded] = useState(expanded)
    const [controlsExpanded, setControlsExpanded] = useState(false)
    const [controlForm, setControlForm] = useState('import')

    if (expanded && expanded !== entryExpanded) {
        setEntryExpanded(expanded)
    }

    const recordedIdsToMerge = useMemo(() => {
        if (profile && profile.recorded) {
            const evIds = cardEvidence.map(ev => ev.matchId)
            return profile.recorded.filter(id => !evIds.includes(id))
        } else {
            return []
        }
    }, [profile, cardEvidence])

    const handleEntryExpand = useCallback((expand) => {
        if (filters['id']) {
            removeFilters(['id'])
        }
        setEntryExpanded(expand)
    }, [filters, removeFilters])

    const handleMergeRecorded = useCallback(() => {
        createEvidenceForEntries(userId, recordedIdsToMerge)
        setControlsExpanded(false)
    }, [createEvidenceForEntries, userId, recordedIdsToMerge])

    const handleOpenControls = useCallback((controlForm) => {
        setControlForm(controlForm)
        setControlsExpanded(!controlsExpanded)
    }, [controlsExpanded])

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const handleDeleteAll = useCallback(() => {
        removeEvidence(cardEvidence)
        removeProfileBlackBeltAwarded(userId)
        handleClose()
    }, [cardEvidence, removeEvidence, handleClose, removeProfileBlackBeltAwarded, userId])

    const buttonsMargin = isMobile ? 10 : 40
    const headerDivStyle = isMobile ? 'block' : 'flex'

    const danSheetImported = profile?.blackBeltAwardedAt > 0
    const addProjectDivWidth = danSheetImported ? '100%' : '50%'

    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>
            <ProfileHeader profile={profile} page={'scorecard'}/>

            {visibleEntries.length > 0 &&
                <React.Fragment>
                    {!isMobile
                        ? <div style={{display: headerDivStyle, padding: '10px 8px 0px 16px'}}>
                            <div style={{marginRight: 0, width: 350}}>
                                <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                            </div>
                            {profile.danLevel > 0 &&
                                <div style={{flexGrow: 1, marginRight: 0}}>
                                    <ScorecardDanStats/>
                                </div>
                            }
                        </div>
                        : <div style={{display: headerDivStyle, padding: '0px 8px 0px 16px'}}>
                            {profile.danLevel > 0 &&
                                <ScorecardDanStats/>
                            }
                            <div style={{marginRight: 0, width: 350}}>
                                <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                            </div>
                        </div>
                    }
                </React.Fragment>
            }

            {(owner || admin) &&
                <Accordion expanded={controlsExpanded} disableGutters={true}>
                    <AccordionSummary style={{
                        paddingLeft: buttonsMargin,
                        paddingRight: buttonsMargin,
                        placeItems: 'center',
                        width: '100%'
                    }}>
                        <div style={{width: '100%', placeItems: 'center', textAlign: 'center'}}>

                            <div style={{display: 'flex', width: '100%', placeItems: 'center', textAlign: 'center'}}>
                                {!danSheetImported &&
                                    <div style={{width: '50%', textAlign: 'center'}}>
                                        <Button variant='outlined' color='secondary' size='small'
                                                style={{lineHeight: '1rem'}}
                                                onClick={() => handleOpenControls('import')}>
                                            IMPORT DAN SHEET
                                        </Button>
                                    </div>
                                }
                                <div style={{width: addProjectDivWidth, textAlign: 'center'}}>
                                    <Button variant='outlined' color='secondary' size='small'
                                            style={{lineHeight: '1rem'}}
                                            onClick={() => handleOpenControls('project')}>ADD PROJECT</Button>
                                </div>
                            </div>

                            {admin &&
                                <div style={{backgroundColor: '#700', padding: 5, marginTop: 20}}>
                                    <div style={{display: 'flex'}}>
                                        <div style={{width: '10%', textAlign: 'center'}}>
                                            admin
                                        </div>
                                        <div style={{width: '30%', textAlign: 'center'}}>
                                            <Button color='secondary' size='small'
                                                    style={{lineHeight: '1rem'}}
                                                    onClick={() => handleOpenControls('import')}>
                                                IMPORT DAN SHEET
                                            </Button>
                                        </div>

                                        <div style={{width: '30%', textAlign: 'center'}}>
                                            <Button color='secondary' size='small' style={{lineHeight: '1rem'}}
                                                    onClick={handleMergeRecorded}>MERGE
                                                RECORDED&nbsp;({recordedIdsToMerge.length})
                                            </Button>
                                        </div>
                                        <div style={{width: '30%', textAlign: 'center'}}>
                                            <Button color='secondary' size='small' style={{lineHeight: '1rem'}}
                                                    onClick={handleOpen}>DELETE SCORECARD</Button>
                                            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                                <div style={{padding: 20, textAlign: 'center'}}>
                                                    You cannot undo delete.<br/>
                                                    Are you sure?
                                                </div>
                                                <div style={{textAlign: 'center'}}>
                                                    <Button style={{marginBottom: 10, color: '#000'}}
                                                            variant='contained'
                                                            onClick={handleDeleteAll}
                                                            edge='start'
                                                            color='error'
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </Menu>
                                        </div>
                                    </div>
                                </div>
                            }

                        </div>
                    </AccordionSummary>

                    <AccordionDetails style={{backgroundColor: '#333'}}>
                        {controlForm === 'import' &&
                            <ImportDanSheetForm setControlsExpanded={setControlsExpanded}/>
                        }
                        {controlForm === 'project' &&
                            <EvidenceForm evid={null} handleUpdate={handleOpenControls} addProject={true}/>
                        }
                    </AccordionDetails>
                </Accordion>
            }

            {visibleEntries.length === 0 &&
                <NoScorecardData/>
            }

            {profile && profile.blackBeltAwardedAt &&
                <BlackBeltAwardRow owner={owner} date={profile.blackBeltAwardedAt.toDate().toJSON()}/>
            }
            <div>
                {visibleEntries.map(ev =>
                    <ScorecardRow key={ev.id}
                                  owner={owner}
                                  evid={ev}
                                  expanded={ev.id === entryExpanded}
                                  onExpand={handleEntryExpand}
                    />
                )}
            </div>
        </div>
    )
}

export default Scorecard
