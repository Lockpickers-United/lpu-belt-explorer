import React, {useState, useMemo, useContext, useCallback} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
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
import {getAwardEntryFromId} from '../entries/entryutils'
import dayjs from 'dayjs'

function ImportPreviewDisplay({owner, profile, adminAction, popular, importResults, service}) {
    const {isMobile} = useWindowSize()
    const {userId} = useParams()
    const navigate = useNavigate()

    const {visibleEntries = [], popularEntries = [], cardActivity} = useContext(ScorecardDataContext)

    const awards = importResults?.awards
        ? importResults?.awards?.map(msg => {
            return {
                ...msg,
                ...getAwardEntryFromId(msg.matchId),
                date: dayjs(msg.awardedAt).format()
            }
        })
        : []

    const belts = awards.filter(award => award.awardType === 'belt')
    const dans = awards.filter(award => award.awardType === 'dan')
    const hof = awards.filter(award => award.awardType === 'hof')

    const verb = awards.length > 1 ? 'are' : 'is'

    console.log('awards', awards)

    const {expanded} = useContext(ScorecardListContext)
    const {filters, setFilters, removeFilters} = useContext(FilterContext)
    const {name, locks} = filters
    const {createEvidenceForEntries, removePickerActivity, refreshPickerActivity} = useContext(DBContext)
    const {admin} = useContext(AppContext)
    const danSheetImported = profile?.blackBeltAwardedAt > 0

    const [entryExpanded, setEntryExpanded] = useState(expanded)
    const [controlsExpanded, setControlsExpanded] = useState(false)
    const [controlForm, setControlForm] = useState('import')
    const [loading, setLoading] = useState(false)
    const [mostPopular, setMostPopular] = useState(locks === 'mostPopular' || popular)

    if (expanded && expanded !== entryExpanded) {
        setEntryExpanded(expanded)
    }

    const handleLink =useCallback(link => {
        navigate(link)
    },[navigate])

    const handleEntryExpand = useCallback((expand) => {
        if (filters['id']) {
            removeFilters(['id'])
        }
        setEntryExpanded(expand)
    }, [filters, removeFilters])

    const flexStyle = isMobile ? 'block' : 'flex'
    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <div style={{display:flexStyle}}>
            <div style={{fontSize: '1.5rem', padding: '16px 16px', flexGrow:1}}>{service} Import Results</div>
            <div style={{padding:16}}>
                <Button
                    variant='contained'
                    color='secondary'
                    style={{lineHeight: '1.2rem'}}
                    onClick={() => handleLink('/profile/scorecard/')}
                >VIEW SCORECARD</Button>
            </div>
            </div>

            <div style={{fontSize: '1rem', padding: '0px 16px'}}>
                <strong>Congratulations {importResults.username}!</strong> Here are your rankings from Discord.
                <div style={{height: 8}}/>


                If you have more than one Discord username, please run the import under both names to get all of your
                rankings.

                Your approved rankings will be updated automatically as long as you have your Discord username in your
                Profile. You can remove (edit??) it at any time on <i>Edit Profile</i>.


            </div>
            <div style={{height: 16}}/>


            <React.Fragment>
                {awards?.length === 0 &&
                    <div>(no results)</div>
                }
                <div>
                    {awards?.map(act =>
                        <ScorecardRow key={act.id}
                                      owner={true}
                                      activity={act}
                                      expanded={act.id === entryExpanded}
                                      onExpand={handleEntryExpand}
                                      merged={profile.blackBeltAwardedAt > 0}
                        />
                    )}
                </div>
            </React.Fragment>

        </div>
    )
}

export default ImportPreviewDisplay
