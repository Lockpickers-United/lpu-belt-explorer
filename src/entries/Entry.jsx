import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {useParams} from 'react-router-dom'
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

function Entry({entry, expanded, onExpand}) {
    const {expandAll} = useContext(DataContext)
    const {userId} = useParams()
    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)

    const allRelatedIds = [...new Set([...(entry.relatedIds || []), ...upgradeTree(entry.id)])]
        .sort((a, b) => {
            return beltSort(allEntriesById[a].belt, allEntriesById[b].belt) || a.localeCompare(b)
        })

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
                    top: ref.current.offsetTop - offset,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        } else if (!expanded) {
            setScrolled(false)
        }
    }, [expanded, entry, scrolled, expandAll])

    const makeModels = useMemo(() => {
        return (
            <Stack direction='column' spacing={0} sx={{flexWrap: 'wrap'}}>
                {entry.makeModels?.map(({make, model}, index) =>
                    <Typography key={index}
                                style={{fontWeight: 500, fontSize: '1.07rem', lineHeight: 1.25, marginBottom: '4px'}}>
                        {make && make !== model ? `${make} ${model}` : model}
                    </Typography>
                )}
            </Stack>
        )
    }, [entry.makeModels])

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <BeltStripe value={entry.belt}/>
                <div style={{margin: '12px 0px 8px 8px', width: '55%', flexShrink: 0, flexDirection: 'column'}}>
                    <FieldValue
                        value={makeModels}
                        textStyle={entry.belt === 'Unranked' ? {color: '#aaa', marginLeft: '0px'} : {marginLeft: '0px'}}
                        style={{marginBottom: '2px'}}
                    />

                    {
                        !!entry.version &&
                        <FieldValue
                            name='Version'
                            value={<Typography
                                style={{fontSize: '0.95rem', lineHeight: 1.25}}>{entry.version}</Typography>}
                            textStyle={entry.belt === 'Unranked' ? {color: '#aaa'} : {}}
                        />
                    }
                </div>
                <div style={{margin: '8px 0px 0px 0px', width: '40%', flexShrink: 0, flexDirection: 'column'}}>
                    {
                        entry.lockingMechanisms?.length > 0 &&
                        <FieldValue
                            value={
                                <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                                    {entry.lockingMechanisms?.map((lockingMechanism, index) =>
                                        <FilterChip
                                            key={index}
                                            value={lockingMechanism}
                                            field='lockingMechanisms'
                                        />
                                    )}
                                </Stack>
                            }
                        />
                    }
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '8px 16px 0px 16px'}}>
                        <Stack direction='row' spacing={1} sx={{width: '100%', flexWrap: 'wrap'}}>
                            <FieldValue
                                style={{width: '50%', marginLeft: '0px'}} value={
                                <React.Fragment>
                                    <Typography style={{
                                        marginLeft: '0px',
                                        fontSize: '1rem',
                                        lineHeight: 1.25,
                                        fontWeight: 500
                                    }}>
                                        {entry.belt}
                                        <DanPoints belt={entry.belt}/>
                                    </Typography>
                                    <BeltIcon value={entry.belt} style={{marginBottom: -10}}/>
                                </React.Fragment>
                            }/>
                            <div style={{marginLeft: 'auto'}}>
                                <CollectionButton id={entry.id} makeModels={entry.makeModels}/>
                            </div>
                        </Stack>
                        <Stack direction='row' spacing={1} sx={{width: '100%', flexWrap: 'wrap'}}>
                            {!!entry.notes &&
                                <FieldValue name='Notes' value={
                                    <Typography component='div' style={{marginTop: -16}}>
                                        <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                                            {entry.notes}
                                        </ReactMarkdown>
                                    </Typography>
                                }/>
                            }
                        </Stack>
                        {!!entry.features?.length &&
                            <FieldValue name='Features' value={
                                <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                                    {entry.features.map((feature, index) =>
                                        <FilterChip
                                            key={index}
                                            value={feature}
                                            field='features'
                                        />
                                    )}
                                </Stack>
                            }/>
                        }
                        {allRelatedIds?.length > 1 && !userId &&
                            <FieldValue name='Other Versions' value={
                                <React.Fragment>
                                    {allRelatedIds.map(relatedId =>
                                        <RelatedEntryButton key={relatedId} id={relatedId} onExpand={onExpand}
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
                        {
                            !!entry.media?.length &&
                            <FieldValue value={
                                <LockImageGallery entry={entry}/>
                            }/>
                        }

                        <div style={{display: 'flex'}}>
                            {
                                !!entry.links?.length &&
                                <FieldValue name='Links' value={
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

                            <FieldValue name='For sale' style={{marginLeft: 15}} value={
                                <OpenLinkToLockbazaarButton entry={entry} buttonType={'text'}/>
                            }/>


                        </div>
                    </AccordionDetails>
                    <AccordionActions disableSpacing>
                        <div style={{display: 'flex', width: '100%'}}>
                            <div style={{flexGrow: 1, justifyItems: 'left'}}>
                                {!expandAll &&

                                    <Tracker feature='lock' id={entry.id}/>
                                }
                                <CopyEntryIdButton entry={entry}/>
                                <OpenLinkToEntryButton entry={entry}/>
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

export default React.memo(Entry, (prevProps, nextProps) => {
    return prevProps.entry.id === nextProps.entry.id &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand
})
