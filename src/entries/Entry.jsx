import React, {useCallback, useEffect, useMemo, useRef} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import belts from '../data/belts'
import BeltStripe from './BeltStripe'
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
import StarButton from './StarButton'

function Entry({entry, expanded, onExpand}) {
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)
    const {danPoints} = belts[entry.belt]

    const handleChange = useCallback((_, isExpanded) => {
        onExpand(isExpanded ? entry.id : false)
    }, [entry.id, onExpand])

    useEffect(() => {
        if (expanded && ref) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === entry.id

            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: ref.current.offsetTop - offset,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        }
    }, [expanded, entry])

    const makeModels = useMemo(() => {
        return (
            <Stack direction='column' spacing={0} sx={{flexWrap: 'wrap'}}>
                {entry.makeModels?.map(({make, model}, index) =>
                    <Typography key={index}>
                        {make && make !== model ? `${make} ${model}` : model}
                    </Typography>
                )}
            </Stack>
        )
    }, [entry.makeModels])

    const lockingMechanisms = useMemo(() => {
        return (
            <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                {entry.lockingMechanisms?.map((lockingMechanism, index) =>
                    <FilterChip
                        key={index}
                        value={lockingMechanism}
                        field='lockingMechanisms'
                    />
                )}
            </Stack>
        )
    }, [entry.lockingMechanisms])

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <BeltStripe value={entry.belt}/>
                <Typography
                    component='span' style={{marginRight: 8}}
                    sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}
                >
                    <FieldValue
                        name='Make / Model'
                        value={makeModels}
                    />

                    {
                        !!entry.version &&
                        <FieldValue
                            name='Version'
                            value={<Typography>{entry.version}</Typography>}
                        />
                    }
                </Typography>
                <Typography component='span' sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}>
                    {
                        entry.lockingMechanisms?.length > 0 &&
                        <FieldValue name='Locking Mechanisms' value={lockingMechanisms}/>
                    }
                </Typography>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails>
                        <FieldValue name='Belt' value={
                            <React.Fragment>
                                <Typography>
                                    {entry.belt} {danPoints > 0 && ` (${danPoints} Dan Point${danPoints > 1 ? 's' : ''})`}
                                </Typography>
                                <BeltIcon value={entry.belt} style={{marginBottom: -10}}/>
                            </React.Fragment>
                        }/>
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
                        <StarButton id={entry.id}/>
                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}

export default React.memo(Entry)
