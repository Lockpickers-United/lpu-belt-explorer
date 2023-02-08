import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js'
import {AccordionActions, Button, ImageList, ImageListItem, ImageListItemBar} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, {useContext, useState} from 'react'
import BeltStripe from './BeltStripe'
import FieldValue from './FieldValue'
import BeltIcon from './BeltIcon'
import {useMediaQuery} from 'react-responsive'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch'
import ReactMarkdown from 'react-markdown'
import belts from './data/belts.js'
import FilterChip from './FilterChip'
import StarIcon from '@mui/icons-material/Star'
import LinkIcon from '@mui/icons-material/Link'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StorageContext from './StorageContext.jsx'
import licenses from './data/licenses.js'

function Entry({expanded, entry, onAccordionChange}) {
    const isBigEnough = useMediaQuery({minWidth: 732})
    const handleChange = (_, isExpanded) => onAccordionChange(isExpanded ? entry.id : false)
    const style = isBigEnough
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
        : {maxWidth: 700, marginLeft: 8, marginRight: 8}
    const {starredEntries, featureFlags, setStorageValue} = useContext(StorageContext)
    const isStarred = starredEntries.includes(entry.id)
    const {isBetaUser = false} = featureFlags

    const handleStarClick = () => {
        const newValue = isStarred
            ? starredEntries.filter(val => val !== entry.id)
            : [...starredEntries, entry.id]

        setTimeout(() => setStorageValue('starredEntries', newValue), 0)
    }

    const link = new URL(window.location.href)
    link.search = `id=${entry.id}`

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <BeltStripe value={entry.belt}/>
                <Typography
                    component='span' style={{marginRight: 8}}
                    sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}
                >
                    <FieldValue name='Make / Model' value={
                        <Stack direction='column' spacing={0} sx={{flexWrap: 'wrap'}}>
                            {entry.makeModels.map(({make, model}, index) =>
                                <Typography key={index}>
                                    {make && make !== model ? `${make} ${model}` : model}
                                </Typography>
                            )}
                        </Stack>
                    }/>
                    {!!entry.version && <FieldValue name='Version' value={entry.version}/>}
                </Typography>
                <Typography component='span' sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}>
                    {
                        entry.lockingMechanisms?.length > 0 &&
                        <FieldValue name='Locking Mechanisms' value={
                            <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                                {entry.lockingMechanisms.map((lockingMechanism, index) =>
                                    <FilterChip
                                        key={index}
                                        value={lockingMechanism}
                                        field='lockingMechanisms'
                                    />
                                )}
                            </Stack>
                        }/>
                    }
                </Typography>
            </AccordionSummary>
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
                    !!entry.media?.length && expanded && isBetaUser &&
                    <FieldValue name='Media' value={
                        <ImageList variant={isBigEnough ? 'quilted' : 'masonry'} cols={isBigEnough ? 4 : 2}>
                            {entry.media.map(({text, url}, index) =>
                                <ImageListItem key={index}>
                                    <img src={url} alt={text}/>
                                    <ImageListItemBar
                                        title={text}
                                        subtitle={
                                            !!entry?.attribution?.[index] &&
                                            <a
                                                href={licenses[entry.attribution[index].text]}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                {entry.attribution[index].text}
                                            </a>
                                        }
                                        actionIcon={
                                            !!entry?.attribution?.[index] &&
                                            (
                                                <IconButton
                                                    href={entry.attribution[index].url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    <LaunchIcon/>
                                                </IconButton>
                                            )
                                        }
                                    />
                                </ImageListItem>
                            )}
                        </ImageList>
                    }/>
                }
                {
                    !!entry.links?.length &&
                    <FieldValue name='Links' value={
                        <Stack direction='row' spacing={1}>
                            {entry.links.map(({text, url}, index) =>
                                <Button
                                    key={index}
                                    href={url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    color='secondary'
                                    sx={{textTransform: 'none'}}
                                >
                                    {text}
                                </Button>
                            )}
                        </Stack>
                    }/>
                }
            </AccordionDetails>
            <AccordionActions>
                <IconButton href={link.href} target='_blank' rel='noopener noreferrer'>
                    <LinkIcon/>
                </IconButton>
                <IconButton onClick={handleStarClick}>
                    {
                        isStarred
                            ? <StarIcon style={isStarred ? {color: 'gold'} : {}}/>
                            : <StarBorderIcon style={isStarred ? {color: 'gold'} : {}}/>
                    }
                </IconButton>
            </AccordionActions>
        </Accordion>
    )
}

export default React.memo(Entry)
