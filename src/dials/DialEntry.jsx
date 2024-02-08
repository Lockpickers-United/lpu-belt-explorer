import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import queryString from 'query-string'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import Tracker from '../app/Tracker'
import FieldValue from '../entries/FieldValue'
import LockImageGallery from '../entries/LockImageGallery'
import FilterChip from '../filters/FilterChip'

function DialEntry({entry, expanded, onExpand}) {
    const {make, model} = entry
    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)

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

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? entry.id : false)
    }, [entry.id, onExpand])

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <div style={{margin: '12px 0px 8px 8px', width: '55%', flexShrink: 0, flexDirection: 'column'}}>
                    <FieldValue
                        value={
                            <Typography
                                style={{fontWeight: 500, fontSize: '1.07rem', lineHeight: 1.25, marginBottom: '4px'}}>
                                {make && make !== model ? `${make} ${model}` : model}
                            </Typography>
                        }
                        textStyle={entry.belt === 'Unranked' ? {color: '#aaa', marginLeft: '0px'} : {marginLeft: '0px'}}
                        style={{marginBottom: '2px'}}
                    />
                    <FieldValue value={entry.ulGroup}/>
                </div>
                <div style={{margin: '8px 0px 0px 0px', width: '40%', flexShrink: 0, flexDirection: 'column'}}>
                    <FieldValue
                        name='Fence Type'
                        value={entry.fenceType}
                    />
                    <FieldValue
                        name='Wheels'
                        value={entry.wheels}
                    />
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '8px 16px 0px 16px'}}>
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
                            <FieldValue value={
                                <LockImageGallery entry={entry}/>
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
                        <Tracker feature='dial' id={entry.id}/>
                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}

export default DialEntry
