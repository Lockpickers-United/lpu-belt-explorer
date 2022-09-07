import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js'
import {Button} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'
import BeltStripe from './BeltStripe.jsx'
import FieldValue from './FieldValue.jsx'

function Belt({index, expanded, belt, onAccordionChange}) {
    const handleChange = (_, isExpanded) => onAccordionChange(isExpanded ? index : false)

    return (
        <Accordion expanded={expanded} onChange={handleChange}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <BeltStripe value={belt.belt}/>
                <Typography
                    component='span' style={{marginRight: 8}}
                    sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}
                >
                    <FieldValue name='Make' value={belt.make}/>
                    <FieldValue name='Model' value={belt.model}/>
                </Typography>
                <Typography component='span' sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}>
                    <FieldValue name='Type' value={belt.type}/>
                    <FieldValue name='Belt' value={belt.belt}/>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {!!belt.notes &&
                    <FieldValue name='Notes' value={
                        <Typography>{belt.notes}</Typography>
                    }/>
                }
                {!!belt.tags.length &&
                    <FieldValue name='Tags' value={
                        <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                            {belt.tags.map((tag, index) =>
                                <Chip
                                    key={index} label={tag} variant='outlined'
                                    style={{marginRight: 4, marginBottom: 4}}
                                />
                            )}
                        </Stack>
                    }/>
                }
                {
                    !!belt.links.length &&
                    <FieldValue name='Links' value={
                        <Stack direction='row' spacing={1}>
                            {belt.links.map(({text, url}, index) =>
                                <Button
                                    key={index} href={url} target='_blank'
                                    rel='noopener noreferrer' color='secondary'>{text}
                                </Button>
                            )}
                        </Stack>
                    }/>
                }
                {
                    !!belt.regions.length &&
                    <FieldValue name='Regions' value={
                        <Stack direction='row' spacing={1}>
                            {belt.regions.map((region, index) =>
                                <Button key={index} color='inherit'>{region}</Button>
                            )}
                        </Stack>
                    }/>
                }
            </AccordionDetails>
        </Accordion>
    )
}

export default React.memo(Belt)
