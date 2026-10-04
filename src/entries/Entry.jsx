import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {useNavigate, useParams} from 'react-router-dom'
import rehypeExternalLinks from 'rehype-external-links'
import BeltStripe from './BeltStripe'
import CollectionButton from './CollectionButton'
import DanPoints from './DanPoints'
import FieldValue from './FieldValue'
import BeltIcon from './BeltIcon'
import ReactMarkdown from 'react-markdown'
import FilterChip from '../filters/FilterChip'
import CopyLinkToEntryButton from './CopyLinkToEntryButton'
import AccordionActions from '@mui/material/AccordionActions'
import Button from '@mui/material/Button'
import CopyEntryTextButton from './CopyEntryTextButton'
import Tracker from '../app/Tracker'
import queryString from 'query-string'
import LockImageGallery from './LockImageGallery'
import RelatedEntryButton from './RelatedEntryButton'
import {allEntriesById, upgradeTree} from './entryutils'
import {beltSort} from '../data/belts'
import CopyEntryIdButton from './CopyEntryIdButton.jsx'
import OpenLinkToEntryButton from './OpenLinkToEntryButton.jsx'
import OpenLinkToLockbazaarButton from './OpenLinkToLockbazaarButton.jsx'
import DataContext from '../context/DataContext.jsx'
import EntryNotes from './EntryNotes'
import LogEntryButton from './LogEntryButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import FilterContext from '../context/FilterContext.jsx'
import entryName from './entryName'
import Link from '@mui/material/Link'
import EntryActionBar from './EntryActionBar.jsx'
import {useAccess} from '../app/AccessContext.jsx'
import ClassificationVotes from '../classification/ClassificationVotes.jsx'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import ListAltIcon from '@mui/icons-material/ListAlt'

function Entry({entry, expanded, onExpand, isClassification, scorecardId}) {
    const navigate = useNavigate()
    const {accessInfo} = useAccess()
    const {expandAll} = useContext(DataContext)
    const {filters} = useContext(FilterContext)
    const {userId} = useParams()
    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)
    const {search} = filters
    const lockName = entryName(entry, 'short', {includeVersion: true})

    const allRelatedIds = [...new Set([...(entry.relatedIds || []), ...upgradeTree(entry.id)])]
        .sort((a, b) => {
            return beltSort(allEntriesById[a].belt, allEntriesById[b].belt) || a.localeCompare(b)
        })
    const upgradeBaseId = upgradeTree(entry.id)[0]

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? entry.id : false)
    }, [entry, onExpand])

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
                    top: ref?.current?.offsetTop - offset,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        } else if (!expanded) {
            setScrolled(false)
        }
    }, [expanded, entry, scrolled, expandAll])

    const makeModels = useMemo(() => {
        return (
            <div style={{fontWeight: 500, fontSize: '1.07rem', lineHeight: 1.5, marginBottom: '4px'}}>
                {entry.makeModels?.map(({make, model}, index) =>
                    <span key={index}>{make && make !== model ? `${make} ${model}` : model}<br/></span>
                )}
            </div>
        )
    }, [entry.makeModels])

    const handleScorecardClick = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        const scorecardLink = scorecardId && userId && `/profile/${userId}/scorecard?scorecardId=${scorecardId}`
        navigate(scorecardLink)
    }, [navigate, scorecardId, userId])

    const textColor = entry.belt === 'Unranked' ? '#aaa' : '#fff'
    const versionColor = entry.belt === 'Unranked' ? '#aaa' : '#ccc'
    const linkSx = {
        color: '#aaa', textDecoration: 'none', cursor: 'pointer', '&:hover': {
            color: '#fff'
        }
    }
    const relatedHeader = upgradeBaseId
        ? <div style={{marginBottom: 2}}>
            Other Versions | <Link sx={linkSx}
                                   onClick={() => navigate(`/profile/scorecard/upgrades?id=${upgradeBaseId}`)}>View
            Upgrades</Link></div>
        : <>Other Versions Only</>

    const {isMobile} = useWindowSize()
    const makeModelWidth = !isMobile ? '65%' : '63%'
    const detailsWidth = scorecardId ? '28%' : '32%'
    const mainMargin = !isMobile ? '6px 0px 8px 12px' : '4px 0px 6px 4px'

    // TODO - don't bring in FilterChip, just render here. Fix add filter for new style.

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref} slots={{heading: 'div'}}
                   role='listitem' aria-label={lockName}>
            <AccordionSummary component='div'
                              nativeButton={false}
                              expandIcon={<ExpandMoreIcon/>}
                              sx={{
                                  '.MuiAccordionSummary-content': {
                                      alignItems: 'center'
                                  }
                              }} style={{}}>

                <BeltStripe value={entry.belt}/>
                <div
                    style={{margin: mainMargin, width: makeModelWidth, flexShrink: 0, flexDirection: 'column'}}>
                    <div style={{
                        color: textColor
                    }}>{makeModels}</div>

                    {!!entry.version &&
                        <div style={{marginTop: 5}}>
                            <div style={{
                                color: versionColor,
                                fontSize: '0.95rem',
                                lineHeight: 1.25,
                                marginTop: 2,
                                marginLeft: 8
                            }}>{entry.version}</div>
                        </div>
                    }
                </div>

                {(entry.lockingMechanisms?.length > 0 || entry.voteEntries) &&
                    <div style={{margin: '0px 0px 0px 0px', flexGrow: 1, flexDirection: 'row'}}>
                        {isClassification && entry.voteEntries &&
                            <div style={{
                                display: 'flex',
                                marginBottom: 12,
                                paddingRight: !isMobile ? 0 : 0,
                                width: '100%',
                                justifyContent: 'left'
                            }}>
                                <ClassificationVotes votes={entry.voteEntries}/>
                            </div>
                        }
                        <div style={{
                            margin: '0px 0px 0px 0px',
                            width: '100%',
                            flexShrink: 0,
                            flexGrow: 1,
                            flexDirection: 'row'
                        }}>
                            {entry.lockingMechanisms?.sort().map((lockingMechanism, index) =>
                                <span key={index}>
                                    {!isClassification
                                        ? <FilterChip mode={'simple'} value={lockingMechanism}
                                                      field='lockingMechanisms'/>
                                        : <FilterChip mode={'text'} style={{color: '#aaa'}}
                                                      value={lockingMechanism}
                                                      field='lockingMechanisms'/>
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                }
                {scorecardId &&
                    <div style={{margin: '0px 10px 0px 0px'}}>
                        <Tooltip title='View in Scorecard' arrow disableFocusListener>
                            <IconButton onClick={handleScorecardClick} size='small' aria-label='scorecard'>
                                <ListAltIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                }

            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '8px 16px 0px 16px'}}>
                        <Stack direction='row' spacing={1} sx={{width: '100%', flexWrap: 'wrap'}}>
                            <FieldValue
                                style={{width: '50%', marginLeft: '0px'}}
                                value={
                                    <React.Fragment>
                                        <Typography style={{
                                            marginLeft: '0px',
                                            fontSize: '1rem',
                                            lineHeight: 1.25,
                                            fontWeight: 500
                                        }} role='heading' aria-level={2}
                                                    aria-label={`${entry.belt} Belt`}>
                                            {entry.belt}
                                            <DanPoints belt={entry.belt}/>
                                        </Typography>
                                        <BeltIcon value={entry.belt}
                                                  style={{marginBottom: -10}}/>
                                    </React.Fragment>
                                }/>
                            <div style={{marginLeft: 'auto'}}>
                                <CollectionButton id={entry.id} makeModels={entry.makeModels}/>
                            </div>
                        </Stack>
                        {!!entry.notes &&
                            <Stack direction='row' spacing={0} sx={{width: '100%', flexWrap: 'wrap'}}>
                                <FieldValue
                                    name='Comments'
                                    value={
                                        <Typography component='div' style={{marginTop: -16}}>
                                            <ReactMarkdown
                                                rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                                                {entry.notes}
                                            </ReactMarkdown>
                                        </Typography>
                                    }/>
                            </Stack>
                        }
                        {!!entry.features?.length &&
                            <FieldValue
                                name='Features'
                                value={
                                    <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                                        {entry.features.map((feature, index) =>
                                            <FilterChip key={index} value={feature} field='features'/>
                                        )}
                                    </Stack>
                                }/>
                        }
                        {allRelatedIds?.length > 1 && !userId &&
                            <FieldValue
                                name={relatedHeader}
                                value={
                                    <React.Fragment>
                                        {allRelatedIds.map(relatedId =>
                                            <RelatedEntryButton key={relatedId}
                                                                id={relatedId}
                                                                onExpand={onExpand}
                                                                entryId={entry.id}/>
                                        )}
                                    </React.Fragment>
                                }/>
                        }

                        {!!entry.description &&
                            <div style={{margin: 8}}>
                                <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                                    target: '_blank',
                                    rel: ['nofollow', 'noopener', 'noreferrer']
                                }]]}>
                                    {entry.description}
                                </ReactMarkdown>
                            </div>
                        }

                        {accessInfo.enabledLevel >= 50 &&
                            <div style={{margin: '24px 0px 20px 6px'}}>
                                <EntryActionBar entry={entry} isClassification={isClassification}/>
                            </div>
                        }

                        <div style={{margin: '12px 0px 20px 6px'}}>
                            <EntryNotes entry={entry}/>
                        </div>

                        {!!entry.media?.length &&
                            <div style={{marginLeft: 6}}>
                                <LockImageGallery entry={entry}/>
                            </div>
                        }

                        <div style={{display: 'flex'}}>
                            {
                                !!entry.links?.length &&
                                <FieldValue name='Links'
                                            value={
                                                <Stack direction='row' spacing={1} sx={{flexWrap: 'wrap'}}>
                                                    {entry.links.map(({title, url}, index) =>
                                                        <Button
                                                            key={index}
                                                            href={url}
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                            color='secondary'
                                                            variant='outlined'
                                                            sx={{textTransform: 'none'}}
                                                            style={{margin: 4}}
                                                        >
                                                            {title}
                                                        </Button>
                                                    )}
                                                </Stack>
                                            }/>
                            }

                            <FieldValue name='For sale'
                                        style={{marginLeft: 15}}
                                        value={
                                            <OpenLinkToLockbazaarButton
                                                entry={entry}
                                                buttonType={'text'}/>
                                        }/>


                        </div>
                    </AccordionDetails>
                    <AccordionActions disableSpacing>
                        <div style={{display: 'flex', width: '100%'}}>
                            <div style={{flexGrow: 1, justifyItems: 'left'}}>
                                {!expandAll && !!search &&
                                    <Tracker feature='lock' id={entry.id} search={search}/>
                                }
                                {!expandAll && !search &&
                                    <Tracker feature='lock' id={entry.id}/>
                                }
                                <CopyEntryIdButton entry={entry}/>
                                <OpenLinkToEntryButton entry={entry}/>
                                <LogEntryButton entry={entry}/>
                            </div>
                            <div style={{display: 'flex'}}>
                                <CopyEntryTextButton entry={entry}/>
                                <CopyLinkToEntryButton entry={entry}/>
                            </div>
                        </div>

                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}

export default React.memo(Entry)
