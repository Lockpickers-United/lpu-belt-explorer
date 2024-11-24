import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Tracker from '../app/Tracker'
import CopyLinkToRaflPotButton from './CopyLinkToRaflPotButton.jsx'
import FieldValue from '../entries/FieldValue'
import FilterChip from '../filters/FilterChip'
import RaffleImageGallery from './RaffleImageGallery.jsx'
import CopyPotTextButton from './CopyPotTextButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import RaffleTitle from './RaffleTitle.jsx'
import WatchlistButton from './WatchlistButton.jsx'
import FilterContext from '../context/FilterContext.jsx'

function RaffleEntry({entry, expanded, onExpand, single}) {
    const {filters} = useContext(FilterContext)
    const shippingFiltered = !!filters.shippingType || !!filters.splitShipping

    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)
    const showSimple = single === '2'

    const ticketCount = entry.tickets
        ? new Intl.NumberFormat().format(entry.tickets)
        : '---'

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

    const {isMobile, flexStyle} = useWindowSize()
    const titleMargin = !isMobile ? '12px 0px 8px 8px' : '12px 0px 8px 0px'
    const contribMargin = !isMobile ? '0px 0px 18px 8px' : '0px 0px 18px 0px'
    const descriptionFontSize = isMobile ? '0.95rem' : '1.0rem'
    const infoOpactiy = entry.winner && !expanded ? 0.6 : 1

        return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={!showSimple ? <ExpandMoreIcon/> : null}>
                <div style={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                    <div style={{display: 'block', marginBottom: 0, flexGrow: 1}}>
                        <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
                            <div style={{margin: titleMargin, display: 'flex', flexGrow: 1}}>
                                <RaffleTitle entry={entry}/>
                            </div>
                        </div>
                        <div style={{margin: contribMargin, display: 'flex'}}>
                            <div style={{flexGrow: 1, opacity: infoOpactiy}}>
                                <div style={{
                                    marginRight: 8,
                                    color: '#bbb',
                                    fontSize: descriptionFontSize
                                }}>Contributed by &nbsp;
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

                            <div style={{
                                marginRight: 10,
                                fontSize: descriptionFontSize,
                                textAlign: 'right',
                                display: flexStyle
                            }}>
                                <div>
                                    <nobr>Donors: <strong>{entry.donors || '--'}</strong></nobr>
                                </div>
                                <div style={{marginLeft: 8}}>
                                    <nobr>Tickets: <strong>{ticketCount}</strong></nobr>
                                </div>
                            </div>
                        </div>
                        {!showSimple && shippingFiltered &&
                            <div style={{display: 'flex', marginTop: 6, opacity: infoOpactiy}}>
                                <div style={{marginRight: 10}}>
                                    <FieldValue name='Country' headerStyle={{marginBottom: 4}} value={
                                        entry.country.map((country, index) => {
                                            const separator = index < entry.country.length - 1 ? ', ' : ''
                                            return (
                                                <span key={index}><FilterChip value={country} field='country'
                                                                              mode={'text'}/>{separator}</span>
                                            )
                                        })}
                                    />
                                </div>
                                <FieldValue name='Shipping Info' headerStyle={{marginBottom: 4}}
                                            value={entry.shippingInfo}/>
                            </div>
                        }
                        <div style={{margin: '12px 12px 8px 8px', fontSize: descriptionFontSize, opacity: infoOpactiy}}>
                            <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                                {entry.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <WatchlistButton id={entry.id}/>

                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '0px 16px 0px 16px'}}>
                        <div style={{display: flexStyle}}>
                            <Stack direction='row' alignItems='flex-start' style={{}}>
                                {!!entry.tags?.length && !showSimple &&
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

                        {!showSimple && !shippingFiltered &&
                            <div style={{display: 'flex', marginTop: 6}}>
                                <div style={{marginRight: 10}}>
                                    <FieldValue name='Country' headerStyle={{marginBottom: 4}} value={
                                        entry.country.map((country, index) => {
                                            const separator = index < entry.country.length - 1 ? ', ' : ''
                                            return (
                                                <span key={index}><FilterChip value={country} field='country'
                                                                              mode={'text'}/>{separator}</span>
                                            )
                                        })}
                                    />
                                </div>
                                <FieldValue name='Shipping Info' headerStyle={{marginBottom: 4}}
                                            value={entry.shippingInfo}/>
                            </div>
                        }

                        {
                            entry.potContents &&
                            <Stack direction='row' spacing={1} sx={{width: '100%', flexWrap: 'wrap', marginTop: '4px'}}>
                                <FieldValue name='Contents' textStyle={{fontSize: descriptionFontSize}} value={
                                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
                                        {entry.potContents}
                                    </ReactMarkdown>
                                }/>
                            </Stack>
                        }
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
                        <Tracker feature='rafl-pot' id={entry.potNumber}/>
                    </AccordionDetails>
                    {!showSimple &&
                        <AccordionActions disableSpacing>
                            <CopyPotTextButton entry={entry}/>
                            <CopyLinkToRaflPotButton entry={entry}/>
                        </AccordionActions>
                    }
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
