import React, {useCallback, useEffect, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Tracker from '../app/Tracker'
import CopyLinkToRaflPotButton from './CopyLinkToRaflPotButton.jsx'
import FieldValue from '../entries/FieldValue'
import FilterChip from '../filters/FilterChip'
import RaffleImageGallery from './RaffleImageGallery.jsx'
import CopyPotTextButton from './CopyPotTextButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'

function RaffleEntry({entry, expanded, onExpand}) {
    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const {isMobile} = useWindowSize()
    const ref = useRef(null)

    useEffect(() => {
        if (expanded && ref && !scrolled) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74

            setScrolled(true)

            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: ref.current.offsetTop - offset,
                    behavior: expanded ? 'auto' : 'smooth'
                })
            }, expanded ? 0 : 100)
        } else if (!expanded) {
            setScrolled(false)
        }
    }, [expanded, entry, scrolled])

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? entry.id : false)
    }, [entry.id, onExpand])

    const infoFlexStyle = isMobile
        ? 'block'
        : 'flex'

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <div style={{display: 'block', marginBottom: 8}}>
                    <div style={{display: 'flex', width: '100%'}}>
                        <div style={{margin: '12px 0px 8px 8px', display: 'flex'}}>
                            <div style={{
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                color: '#000',
                                height: 32,
                                width: 32,
                                marginTop: 2,
                                marginRight: 10,
                                fontWeight: 700,
                                fontSize: '1.3rem',
                                lineHeight: '2.0rem',
                                textAlign: 'center'
                            }}>{entry.potNumber}</div>
                            <div style={{fontWeight: 500, fontSize: '1.5rem', marginTop: 0, marginBottom: '4px'}}>
                                {entry.title}
                            </div>
                        </div>
                    </div>
                    <div style={{margin: '0px 0px 18px 8px', display: 'flex'}}>
                        <div style={{marginRight: 8}}>Contributed By:</div>
                        <div>
                            {entry.contributedBy.map((contrib, index) => {
                                const separator = index < entry.contributedBy.length - 1 ? ', ' : ''
                                return (
                                    <span key={index}>
                                    <FilterChip
                                        value={contrib}
                                        field='contributedBy'
                                        mode={'text'}
                                    />{separator}
                                </span>
                                )
                            })}
                        </div>
                    </div>
                    <div style={{margin: '12px 30px 8px 8px', fontSize: '1.1rem'}}>
                        <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                            {entry.description}
                        </ReactMarkdown>
                    </div>
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '0px 16px 0px 16px'}}>
                        <div style={{display: infoFlexStyle}}>
                            <Stack direction='row' alignItems='flex-start' style={{}}>
                                {!!entry.tags?.length &&
                                    <FieldValue name='Tags' value={
                                        <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                                            {entry.tags.map((tag, index) =>
                                                <FilterChip
                                                    key={index}
                                                    value={tag}
                                                    field='tags'
                                                    mode={'simple'}
                                                />
                                            )}
                                        </Stack>
                                    } headerStyle={{marginBottom: 4}}/>
                                }
                            </Stack>
                        </div>

                        <div style={{display: 'flex', marginTop:6}}>
                            {entry.country &&
                                <FieldValue name='Country' headerStyle={{marginBottom: 4}}
                                            value={entry.country} textStyle={{marginRight:20}}/>
                            }

                            {entry.shippingInfo &&
                                <FieldValue name='Shipping Info' headerStyle={{marginBottom: 4}}
                                            value={entry.shippingInfo}/>
                            }

                        </div>

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

                        {
                            !!entry.media?.length &&
                            <FieldValue value={
                                <RaffleImageGallery entry={entry}/>
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
                        <Tracker feature='rafl-pot' id={entry.potNumber}/>
                        <CopyPotTextButton entry={entry}/>
                        <CopyLinkToRaflPotButton entry={entry}/>
                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}


export default React.memo(RaffleEntry, (prevProps, nextProps) => {
    const prevEntryKeys = Object.keys(prevProps.entry)
    const nextEntryKeys = Object.keys(nextProps.entry)

    if (prevEntryKeys.length !== nextEntryKeys.length) {
        return false
    }
    for (let idx = 0; idx < prevEntryKeys.length; idx++) {
        if (prevEntryKeys[idx] !== nextEntryKeys[idx] || prevProps.entry[prevEntryKeys[idx]] !== nextProps.entry[nextEntryKeys[idx]]) {
            return false
        }
    }
    return prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand
})