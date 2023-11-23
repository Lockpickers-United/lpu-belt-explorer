import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import belts from '../data/belts'
import BeltStripe from './BeltStripe'
import CollectionButton from './CollectionButton'
import FieldValue from './FieldValue'
import BeltIcon from './BeltIcon'
import ReactMarkdown from 'react-markdown'
import FilterChip from '../filters/FilterChip'
import LinkToEntryButton from './LinkToEntryButton'
import ImageGallery from './ImageGallery'
import AccordionActions from '@mui/material/AccordionActions'
import Button from '@mui/material/Button'
import CopyEntryButton from './CopyEntryButton'
import Tracker from '../app/Tracker'
import queryString from 'query-string'
import RelatedEntryButton from './RelatedEntryButton'

function Entry({entry, expanded, onExpand}) {
    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)
    const {danPoints} = belts[entry.belt]

    const handleChange = useCallback((_, isExpanded) => {
        onExpand(isExpanded ? entry.id : false)
    }, [entry.id, onExpand])

    useEffect(() => {
        if (expanded && ref && !scrolled) {
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
    }, [expanded, entry, scrolled])

    const makeModels = useMemo(() => {
        return (
            <Stack direction='column' spacing={0} sx={{flexWrap: 'wrap'}}>
                {entry.makeModels?.map(({make, model}, index) =>
                    <Typography key={index} style={{fontWeight: 500}}>
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
                <div style={{marginRight: 8, width: '50%', flexShrink: 0, flexDirection: 'column'}}>
                    <FieldValue
                        name='Make / Model'
                        value={makeModels}
                        textStyle={entry.belt === 'Unranked' ? {color: '#aaa'} : {}}
                    />

                    {
                        !!entry.version &&
                        <FieldValue
                            name='Version'
                            value={<Typography>{entry.version}</Typography>}
                            textStyle={entry.belt === 'Unranked' ? {color: '#aaa'} : {}}
                        />
                    }
                </div>
                <div style={{width: '50%', flexShrink: 0, flexDirection: 'column'}}>
                    {
                        entry.lockingMechanisms?.length > 0 &&
                        <FieldValue name='Locking Mechanisms' value={
                            <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                                {entry.lockingMechanisms?.map((lockingMechanism, index) =>
                                    <FilterChip
                                        key={index}
                                        value={lockingMechanism}
                                        field='lockingMechanisms'
                                    />
                                )}
                            </Stack>
                        }/>
                    }
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails>
                        <Stack direction='row' spacing={1} sx={{width: '100%', flexWrap: 'wrap'}}>
                            <FieldValue name='Belt' style={{width: '45%'}} value={
                                <React.Fragment>
                                    <Typography>
                                        {entry.belt} {danPoints > 0 && ` (${danPoints} Dan Point${danPoints > 1 ? 's' : ''})`}
                                    </Typography>
                                    <BeltIcon value={entry.belt} style={{marginBottom: -10}}/>
                                </React.Fragment>
                            }/>
                            {!!entry.relatedIds &&
                                <FieldValue name='Other Versions' style={{width: '45%'}} value={
                                    <React.Fragment>
                                        {entry.relatedIds.map(relatedId =>
                                            <RelatedEntryButton key={relatedId} id={relatedId}/>
                                        )}
                                    </React.Fragment>
                                }/>
                            }
                        </Stack>
                        {!!entry.notes &&
                            <FieldValue name='Notes' value={
                                <Typography component='div' style={{marginTop: -16}}>
                                    <ReactMarkdown linkTarget='_blank'>
                                        {entry.notes}
                                    </ReactMarkdown>
                                </Typography>
                            }/>
                        }
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
                        {
                            !!entry.media?.length &&
                            <FieldValue name='Media' value={
                                <ImageGallery entry={entry}/>
                            }/>
                        }
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
                    </AccordionDetails>
                    <AccordionActions disableSpacing>
                        <Tracker id={entry.id}/>
                        <CopyEntryButton entry={entry}/>
                        <LinkToEntryButton entry={entry}/>
                        <CollectionButton id={entry.id}/>
                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}

export default React.memo(Entry)
