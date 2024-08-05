import React, {useState, useMemo, useContext, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import Button from '@mui/material/Button'
import DBContext from '../app/DBContext.jsx'
import ScorecardRow from './ScorecardRow.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
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

function Scorecard({owner, profile}) {
    const {isMobile} = useWindowSize()
    const {userId} = useParams()
    const {admin} = useContext(DBContext)

    const {visibleEntries = [], cardEvidence} = useContext(ScorecardDataContext)
    const {createEvidenceForEntries, removeEvidence} = useContext(DBContext)

    const [expanded, setExpanded] = useState(false)
    const [controlsExpanded, setControlsExpanded] = useState(false)
    const [controlForm, setControlForm] = useState('import')

    const recordedIdsToMerge = useMemo(() => {
        if (profile && profile.recorded) {
            const evIds = cardEvidence.map(ev => ev.matchId)
            return profile.recorded.filter(id => !evIds.includes(id))
        } else {
            return []
        }
    }, [profile, cardEvidence])

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
        handleClose()
    }, [cardEvidence, removeEvidence, handleClose])

    const buttonsMargin = isMobile ? 10 : 40
    const headerDivStyle = isMobile ? 'block' : 'flex'
    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>
            <ProfileHeader profile={profile} page={'scorecard'}/>

            {!isMobile
                ? <div style={{display: headerDivStyle, padding: '10px 8px 0px 16px'}}>
                    <div style={{marginRight: 0, width: 350}}>
                        <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                    </div>
                    <div style={{flexGrow: 1, marginRight: 0}}>
                        <ScorecardDanStats/>
                    </div>
                </div>
                : <div style={{display: headerDivStyle, padding: '0px 8px 0px 16px'}}>
                    <ScorecardDanStats/>
                    <div style={{marginRight: 0, width: 350}}>
                        <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                    </div>
                </div>
            }

            {(owner || admin) &&
                <Accordion expanded={controlsExpanded} disableGutters={true}>

                    <AccordionSummary style={{
                        paddingLeft: buttonsMargin,
                        paddingRight: buttonsMargin,
                        display: 'flex',
                        placeItems: 'center',
                        width: '100%'
                    }}>
                        <div style={{width: '33%', textAlign: 'center'}}>
                            <Button color='secondary' size='small' style={{lineHeight: '1rem'}}
                                    onClick={handleMergeRecorded}>MERGE RECORDED&nbsp;({recordedIdsToMerge.length})
                            </Button>
                        </div>

                        <div style={{width: '33%', textAlign: 'center'}}>
                            <Button color='secondary' size='small' style={{lineHeight: '1rem'}}
                                      onClick={handleOpen}>DELETE ALL</Button>
                            <Button color='secondary' size='small' style={{lineHeight: '1rem'}}
                                      onClick={() => handleOpenControls('import')}>
                                IMPORT DAN SHEET
                            </Button>
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

                        <div style={{width: '33%', textAlign: 'center'}}>
                            <Button color='secondary' size='small' style={{lineHeight: '1rem'}}
                                    onClick={() => handleOpenControls('project')}>ADD PROJECT</Button>
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
            {profile && profile.blackBeltAwardedAt &&
                <BlackBeltAwardRow owner={owner} date={profile.blackBeltAwardedAt.toDate().toJSON()}/>
            }
            <div>
                {visibleEntries.map(ev =>
                    <ScorecardRow key={ev.id}
                                  owner={owner}
                                  evid={ev}
                                  expanded={ev.id === expanded}
                                  onExpand={setExpanded}
                    />
                )}
            </div>
        </div>
    )
}

export default Scorecard
