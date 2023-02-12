import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js'
import {AccordionActions, Button} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, {useCallback, useContext, useMemo} from 'react'
import BeltStripe from './BeltStripe'
import FieldValue from './FieldValue'
import BeltIcon from './BeltIcon'
import IconButton from '@mui/material/IconButton'
import ReactMarkdown from 'react-markdown'
import belts from './data/belts.js'
import FilterChip from './FilterChip'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StorageContext from './StorageContext.jsx'
import LinkToEntryButton from './LinkToEntryButton.jsx'
import ImageGallery from './ImageGallery.jsx'

function Entry({expanded, entry, onAccordionChange}) {
    const handleChange = (_, isExpanded) => onAccordionChange(isExpanded ? entry.id : false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const {starredEntries, setStorageValue} = useContext(StorageContext)
    const isStarred = starredEntries.includes(entry.id)

    const handleStarClick = useCallback(() => {
        const newValue = isStarred
            ? starredEntries.filter(val => val !== entry.id)
            : [...starredEntries, entry.id]

        setTimeout(() => setStorageValue('starredEntries', newValue), 0)
    }, [entry.id, isStarred, setStorageValue, starredEntries])

    const makeModels = useMemo(() => {
        return (
            <Stack direction='column' spacing={0} sx={{flexWrap: 'wrap'}}>
                {entry?.makeModels?.map(({make, model}, index) =>
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
                {entry?.lockingMechanisms?.map((lockingMechanism, index) =>
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
        <Accordion expanded={expanded} onChange={handleChange} style={style}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <BeltStripe value={entry.belt}/>
                <Typography
                    component='span' style={{marginRight: 8}}
                    sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}
                >
                    <FieldValue name='Make / Model' value={makeModels}/>
                    {!!entry.version && <FieldValue name='Version' value={entry.version}/>}
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
                                <Typography>{belts[entry.belt].label}</Typography>
                                <BeltIcon value={entry.belt} style={{marginBottom: -10}}/>
                            </React.Fragment>

                        }/>
                        {!!entry.notes &&
                            <FieldValue name='Notes' value={
                                <Typography component='div'>
                                    <ReactMarkdown>
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
                            !!entry.media?.length && expanded &&
                            <FieldValue name='Media' value={
                                <ImageGallery entry={entry}/>
                            }/>
                        }
                        {
                            !!entry.links?.length &&
                            <FieldValue name='Links' value={
                                <Stack direction='row' spacing={1}>
                                    {entry.links.map(({title, url}, index) =>
                                        <Button
                                            key={index}
                                            href={url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            color='secondary'
                                            sx={{textTransform: 'none'}}
                                        >
                                            {title}
                                        </Button>
                                    )}
                                </Stack>
                            }/>
                        }
                    </AccordionDetails>
                    <AccordionActions>
                        <LinkToEntryButton id={entry.id}/>
                        <IconButton onClick={handleStarClick}>
                            {
                                isStarred
                                    ? <StarIcon style={isStarred ? {color: 'gold'} : {}}/>
                                    : <StarBorderIcon style={isStarred ? {color: 'gold'} : {}}/>
                            }
                        </IconButton>
                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}

export default React.memo(Entry)
