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
import LoadingDisplay from '../misc/LoadingDisplay'
import ImportDanSheetForm from './ImportDanSheetForm.jsx'
import EvidenceForm from './EvidenceForm.jsx'
import Menu from '@mui/material/Menu'
import ProfileHeader from '../profile/ProfileHeader.jsx'
import NoScorecardData from './NoScorecardData.jsx'
import IntroCopy from '../misc/IntroCopy.jsx'
import PopularEntries from './mostPopular/PopularEntries.jsx'
import CachedIcon from '@mui/icons-material/Cached'
import IconButton from '@mui/material/IconButton'
import ImportButton from './ImportButton.jsx'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import SearchBox from '../nav/SearchBox.jsx'
import {scorecardSortFields} from '../data/sortFields'
import Nav from '../nav/Nav.jsx'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'

function Scorecard({owner, profile, adminAction, popular}) {
    const {isMobile} = useWindowSize()
    const {userId} = useParams()

    // 04/26/2025 - removed link to https://lpubelts.com/#/scorecard/info/FAQ

    const {
        visibleEntries = [],
        popularEntries = [],
        bbPopularEntries = [],
        cardActivity,
        cardMaxBelt
    } = useContext(ScorecardDataContext)

    const {expanded} = useContext(ScorecardListContext)
    const {filters, filterCount, setFilters, removeFilters} = useContext(FilterContext)
    const {name, locks} = filters
    const {createEvidenceForEntries, removePickerActivity, refreshPickerActivity} = useContext(DBContext)
    const {admin} = useContext(AppContext)

    const [entryExpanded, setEntryExpanded] = useState(expanded)
    const [controlsExpanded, setControlsExpanded] = useState(false)
    const [controlForm, setControlForm] = useState('import')
    const [loading, setLoading] = useState(false)
    const [mostPopular, setMostPopular] = useState(locks === 'mostPopular' || popular)

    if (expanded && expanded !== entryExpanded) {
        setEntryExpanded(expanded)
    }

    const recordedIdsToMerge = useMemo(() => {
        if (profile && profile.recorded) {
            const evIds = cardActivity.map(ev => ev.matchId)
            return profile.recorded.filter(id => !evIds.includes(id))
        } else {
            return []
        }
    }, [profile, cardActivity])

    const handleEntryExpand = useCallback((expand) => {
        if (filters['id']) {
            removeFilters(['id'])
        }
        setEntryExpanded(expand)
    }, [filters, removeFilters])

    const handleMergeRecorded = useCallback(async () => {
        setLoading(true)
        await createEvidenceForEntries(userId, recordedIdsToMerge)
        setControlsExpanded(false)
        setLoading(false)
        adminAction()
    }, [createEvidenceForEntries, userId, recordedIdsToMerge, adminAction])

    const handleOpenControls = useCallback((newForm) => {
        if (controlForm === newForm) {
            setControlsExpanded(!controlsExpanded)
            setControlForm(undefined)
        } else if ((controlForm === 'lock' && newForm === 'project') || (controlForm === 'project' && newForm === 'lock')) {
            setControlForm(newForm)
        } else {
            setControlForm(newForm)
            setControlsExpanded(!controlsExpanded)
        }
    }, [controlForm, controlsExpanded])

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }, [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const handleDeleteAll = useCallback(async () => {
        setLoading(true)
        await removePickerActivity(cardActivity)
        handleClose()
        setLoading(false)
        adminAction()
    }, [cardActivity, removePickerActivity, handleClose, adminAction])

    const handleLocksToggle = useCallback(() => {
        setControlsExpanded(false)
        setControlForm(undefined)
        const newFilters = mostPopular ? {name: name} : {locks: 'mostPopular', name: name}
        setFilters(newFilters)
        setMostPopular(!mostPopular)
    }, [mostPopular, name, setFilters])

    const handleRefresh = useCallback(async () => {
        setLoading(true)
        await refreshPickerActivity(userId)
        setLoading(false)
        adminAction()
        window.location.reload()
    }, [adminAction, refreshPickerActivity, userId])

    const ownerName = profile?.displayName && !profile['privacyAnonymous']
        ? profile.displayName.toLowerCase().endsWith('s')
            ? `${profile.displayName}'`
            : `${profile.displayName}'s`
        : 'Anonymous'

    const nav = (window.location.hash.search(/locks=mostPopular/) < 1 && !mostPopular)
        ? (
            <React.Fragment>
                <SearchBox label='Scorecard' extraFilters={[{key: 'tab', value: 'search'}]}/>
                <ViewFilterButtons sortValues={scorecardSortFields} advancedEnabled={true}
                                   extraFilters={[{key: 'tab', value: 'search'}]}
                                   compactMode={false} resetAll={true} expandAll={false}/>
                {!isMobile && <div style={{flexGrow: 1, minWidth: 10}}/>}
            </React.Fragment>
        )
        : null

    const buttonText = owner ? 'My Locks' : `${ownerName} Locks`
    const buttonsMargin = 15
    const headerDivStyle = isMobile ? 'block' : 'flex'
    const buttonMarginTop = isMobile ? 6 : 0

    return (
        <React.Fragment>
            <Nav title='Scorecard' extras={nav}/>

            <div style={{
                maxWidth: 700, padding: 0, backgroundColor: '#222',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16
            }}>
                <ProfileHeader profile={profile} page={'scorecard'} owner={owner} mostPopular={mostPopular}/>

                {owner && visibleEntries.length === 0 && !profile?.tabClaimed &&
                    <div style={{margin: 8, padding: '0px 0px'}}>
                        <IntroCopy pageName={'scorecard'}/>
                    </div>
                }

                {visibleEntries.length > 0 &&
                    <React.Fragment>
                        {!isMobile
                            ? <div style={{display: headerDivStyle, padding: '10px 8px 0px 16px'}}>
                                <div style={{marginRight: 10, width: 370}}>
                                    <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                                </div>
                                {profile.danLevel >= 0 &&
                                    <div style={{flexGrow: 1, marginRight: 0}}>
                                        <ScorecardDanStats profile={profile} owner={owner}/>
                                    </div>
                                }
                            </div>
                            : <div style={{display: headerDivStyle, padding: '0px 8px 0px 16px'}}>
                                {profile?.blackBeltAwardedAt > 0 &&
                                    <ScorecardDanStats profile={profile} owner={owner}/>
                                }
                                <div style={{marginRight: 0, width: '95%'}}>
                                    <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                                </div>
                            </div>
                        }
                    </React.Fragment>
                }
                <Accordion expanded={controlsExpanded} disableGutters={true}>
                    <AccordionSummary style={{
                        paddingLeft: buttonsMargin,
                        paddingRight: buttonsMargin,
                        placeItems: 'center',
                        width: '100%'
                    }}>
                        <div style={{width: '100%', placeItems: 'center', textAlign: 'center'}}>

                            <div style={{
                                display: headerDivStyle,
                                width: '100%',
                                placeItems: 'center',
                                textAlign: 'center'
                            }}>
                                {(owner || admin) &&
                                    <div style={{width: '100%', textAlign: 'left'}}>

                                        <Button variant='contained' size='small' color='secondary'
                                                style={{lineHeight: '1.2rem', marginLeft: 6}}
                                                onClick={() => handleOpenControls('lock')}>
                                            ADD LOCK
                                        </Button>
                                        <ImportButton profile={profile}/>
                                        <Button variant='outlined' color='secondary' size='small'
                                                style={{lineHeight: '1.2rem', marginLeft: 6}}
                                                onClick={() => handleOpenControls('project')}>
                                            ADD PROJECT
                                        </Button>

                                    </div>
                                }
                                <div style={{
                                    width: '100%',
                                    textAlign: 'right',
                                    display: 'flex',
                                    marginTop: buttonMarginTop
                                }}>
                                    <div style={{flexGrow: 1}}/>
                                    <ToggleButtonGroup exclusive>
                                        <ToggleButton variant='outlined' color='info' size='small'
                                                      disabled={!mostPopular}
                                                      style={{
                                                          padding: '4px 10px', borderColor: '#236585',
                                                          color: !mostPopular ? '#38b9f6' : '#aaa',
                                                          backgroundColor: !mostPopular ? '#333' : 'transparent'
                                                      }}
                                                      onClick={() => handleLocksToggle()} value={'myLocks'}>
                                            <nobr>{buttonText}</nobr>
                                        </ToggleButton>
                                        <ToggleButton variant='outlined' color='info' size='small'
                                                      disabled={mostPopular}
                                                      style={{
                                                          padding: '4px 10px', borderColor: '#236585',
                                                          color: mostPopular ? '#38b9f6' : '#aaa',
                                                          backgroundColor: mostPopular ? '#333' : 'transparent'
                                                      }}
                                                      onClick={() => handleLocksToggle()} value={'mostPopular'}>
                                            MOST&nbsp;POPULAR
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </div>


                            {loading && <LoadingDisplay/>}

                            {admin && !loading &&
                                <div style={{backgroundColor: '#700', padding: 5, marginTop: 20}}>
                                    <div style={{display: 'flex'}}>
                                        <div style={{width: '10%', textAlign: 'center'}}>
                                            ADMIN
                                        </div>
                                        <Button color='secondary' size='small'
                                                style={{lineHeight: '1.2rem', marginLeft: 6}}
                                                onClick={() => handleOpenControls('award')}>
                                            ADD BELT
                                        </Button>

                                        <Button color='secondary' size='small'
                                                style={{lineHeight: '1rem'}}
                                                onClick={() => handleOpenControls('import')}>
                                            IMPORT DAN SHEET
                                        </Button>
                                        <Button color='secondary' size='small' style={{lineHeight: '1rem'}}
                                                onClick={handleMergeRecorded}>MERGE
                                            RECORDED&nbsp;({recordedIdsToMerge.length})
                                        </Button>
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
                                        <IconButton color='secondary' onClick={handleRefresh}>
                                            <CachedIcon/>
                                        </IconButton>
                                    </div>
                                </div>
                            }

                        </div>
                    </AccordionSummary>

                    <AccordionDetails style={{backgroundColor: '#333'}}>
                        {controlForm === 'import' &&
                            <ImportDanSheetForm setControlsExpanded={setControlsExpanded} adminAction={adminAction}/>
                        }
                        {controlForm === 'lock' &&
                            <EvidenceForm activity={null} handleUpdate={handleOpenControls} addLock={true}
                                          owner={owner}/>
                        }
                        {controlForm === 'project' &&
                            <EvidenceForm activity={null} handleUpdate={handleOpenControls} addProject={true}
                                          owner={owner}/>
                        }
                        {controlForm === 'award' &&
                            <EvidenceForm activity={null} handleUpdate={handleOpenControls} addAward={true}
                                          owner={owner}/>
                        }
                    </AccordionDetails>
                </Accordion>

                {filterCount > 0 &&
                    <AdvancedFilters profile={profile} collectionType={'scorecard'}/>
                }
                {!mostPopular &&
                    <React.Fragment>
                        {visibleEntries.length === 0 &&
                            <NoScorecardData/>
                        }
                        <div>
                            {visibleEntries.map(act =>
                                <ScorecardRow key={act.id}
                                              owner={owner}
                                              activity={act}
                                              expanded={act.id === entryExpanded}
                                              onExpand={handleEntryExpand}
                                              merged={profile.blackBeltAwardedAt > 0}
                                />
                            )}
                        </div>
                    </React.Fragment>
                }
                {mostPopular &&
                    <PopularEntries owner={owner} profile={profile} adminAction={adminAction}
                                    popularType={cardMaxBelt?.rank < 9 ? 'all' : 'BB'}
                                    popularEntries={cardMaxBelt?.rank < 9 ? popularEntries : bbPopularEntries}/>
                }
            </div>
        </React.Fragment>
    )
}

export default Scorecard
