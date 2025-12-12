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
import {Collapse} from '@mui/material'
import RaffleContext from './RaffleContext.jsx'
import DataContext from '../context/DataContext.jsx'
import Box from '@mui/material/Box'
import CopyEntryIdButton from '../entries/CopyEntryIdButton.jsx'
import LogEntryButton from '../entries/LogEntryButton.jsx'

function RaffleEntry({entry, expanded, onExpand, drawing}) {

    if (!entry) return null

    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const {expandAll} = useContext(DataContext)
    const showFull = ['live', 'post'].includes(raflState) || raffleAdminRole

    const {filters} = useContext(FilterContext)
    const shippingFiltered = !!filters.shippingType || !!filters.splitShipping || !!filters.usShipText

    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)

    const ticketCount = entry.totalTickets
        ? new Intl.NumberFormat().format(entry.totalTickets)
        : '---'

    useEffect(() => {
        if (expanded && ref && !scrolled && !expandAll) {
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
    }, [expanded, entry, scrolled, expandAll])

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? entry.id : false)
    }, [entry.id, onExpand])

    const {isMobile, flexStyle} = useWindowSize()
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const titleMargin = !isMobile ? '12px 0px 8px 8px' : '12px 0px 8px 0px'
    const contribMargin = !isMobile ? '0px 0px 0px 8px' : '0px 0px 0px 0px'
    const descriptionMargin = !isMobile ? '12px 0px 0px 8px' : '12px 0px 0px 0px'
    const descriptionFontSize = isMobile ? '1rem' : '1.1rem'
    const contentsFontSize = isMobile ? '0.95rem' : '1.0rem'
    const infoOpacity = entry.winners?.length > 0 && !expanded ? 0.5 : 1

    const usShipColor = {Yes: '#50af53', No: '#ec5345', Split: '#e39a29', 'Winner pays fees': '#e39a29'}
    const usShipText = {
        Yes: '',
        No: 'Cannot ship to the US',
        Split: 'US winner splits tariffs & fees',
        'Winner pays fees': 'US winner pays tariffs & fees'
    }

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>} style={{marginBottom: 10}}>
                <div style={{width: '100%', marginBottom: 0}}>
                    <div style={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                        <div style={{display: 'block', marginBottom: 0, flexGrow: 1}}>
                            <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
                                <div style={{margin: titleMargin, display: 'flex', flexGrow: 1}}>
                                    <RaffleTitle entry={entry} drawing={drawing}/>
                                </div>
                            </div>
                            <div style={{margin: contribMargin, display: 'flex'}}>
                                <div style={{flexGrow: 1, opacity: infoOpacity}}>
                                    <div style={{
                                        marginRight: 8,
                                        color: '#bbb',
                                        fontSize: '1.0rem'
                                    }}>Contributed by &nbsp;
                                        {entry.contributedBy?.map((contrib, index) => {
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

                                {showFull &&
                                    <Collapse in={entry.uniqueDonorCount > 0}>
                                        <div style={{
                                            marginRight: 10,
                                            fontSize: descriptionFontSize,
                                            textAlign: 'right',
                                            display: flexStyle,
                                            opacity: infoOpacity
                                        }}>
                                            <div>
                                                <nobr>Donors <strong>{entry.uniqueDonorCount || '--'}</strong></nobr>
                                            </div>
                                            <div style={{marginLeft: 16}}>
                                                <nobr>Tickets <strong>{ticketCount}</strong></nobr>
                                            </div>
                                        </div>
                                    </Collapse>
                                }
                            </div>

                            {shippingFiltered &&
                                <div style={{display: flexStyle, marginTop: 6, opacity: infoOpacity}}>
                                    <div style={{display: 'flex'}}>
                                        {entry.country.length > 0 &&
                                            <div style={{marginRight: 10}}>
                                                <FieldValue name='Country' headerStyle={{marginBottom: 4}} value={
                                                    entry.country.map((country, index) => {
                                                        const separator = index < entry.country.length - 1 ? ', ' : ''
                                                        return (
                                                            <span key={index}><FilterChip value={country}
                                                                                          field='country'
                                                                                          mode={'text'}/>{separator}</span>
                                                        )
                                                    })}
                                                />
                                            </div>
                                        }
                                        {entry.shippingInfo &&
                                            <div style={{marginRight: 10}}>
                                                <FieldValue name='Shipping Info'
                                                            headerStyle={{marginBottom: 4}}
                                                            value={entry.shippingInfo}/>
                                            </div>
                                        }
                                    </div>
                                    {entry.shipsToUS && entry.shipsToUS !== 'Yes' &&
                                        <FieldValue name='US Shipping Details'
                                                    headerStyle={{marginBottom: 4}}
                                                    textStyle={{color: usShipColor[entry.shipsToUS]}}
                                                    value={usShipText[entry.shipsToUS]}/>
                                    }
                                </div>
                            }
                            {entry.description &&
                                <Box style={{
                                    margin: descriptionMargin,
                                    fontSize: descriptionFontSize,
                                    opacity: infoOpacity
                                }}>
                                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}
                                                   components={{p: 'div'}}>
                                        {entry.description}
                                    </ReactMarkdown>
                                </Box>
                            }
                        </div>

                        {showFull && !drawing &&
                            <WatchlistButton id={entry.id}/>
                        }

                    </div>
                </div>

            </AccordionSummary>
            {expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '0px 16px 0px 16px'}}>
                        {entry.descriptionContinued?.length > 0 &&
                            <div style={{
                                margin: !isMobile ? '0px 0px 12px 8px' : '0px 0px 12px 0px',
                                fontSize: descriptionFontSize,
                                opacity: infoOpacity
                            }}>
                                {entry.descriptionContinued}
                            </div>
                        }

                        <div style={{display: flexStyle}}>
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

                        {!shippingFiltered &&
                            <div style={{display: flexStyle, marginTop: 6}}>
                                <div style={{display: 'flex'}}>
                                    {entry.country.length > 0 &&
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
                                    }
                                    {entry.shippingInfo &&
                                        <div style={{marginRight: 10}}>
                                            <FieldValue name='Shipping Info'
                                                        headerStyle={{marginBottom: 4}}
                                                        value={entry.shippingInfo}/>
                                        </div>
                                    }
                                </div>
                                {entry.shipsToUS && entry.shipsToUS !== 'Yes' &&
                                    <FieldValue name='US Shipping Details'
                                                headerStyle={{marginBottom: 4}}
                                                textStyle={{color: usShipColor[entry.shipsToUS], fontWeight: entry.shipsToUS === 'No' ? 500 : 400}}
                                                value={usShipText[entry.shipsToUS]}/>
                                }
                            </div>
                        }

                        {entry.potContents &&
                            <Stack direction='row' spacing={1} sx={{width: '100%', flexWrap: 'wrap', marginTop: '4px'}}>
                                <FieldValue name='Contents' textStyle={{fontSize: contentsFontSize}} value={
                                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                                        target: '_blank',
                                        rel: ['nofollow', 'noopener', 'noreferrer']
                                    }]]}>
                                        {entry.potContents}
                                    </ReactMarkdown>
                                }/>
                            </Stack>
                        }
                        {!!entry.media?.length &&
                            <FieldValue value={
                                <RaffleImageGallery entry={entry}/>
                            }/>
                        }
                        {!!entry.links?.length &&
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
                        {!expandAll &&
                            <Tracker feature='raflPot' id={entry.id}/>
                        }
                    </AccordionDetails>
                    <AccordionActions disableSpacing>
                        <div style={{display: 'flex', width: '100%'}}>
                            <div style={{flexGrow: 1, justifyItems: 'left'}}>
                                <CopyEntryIdButton entry={entry}/>
                                <LogEntryButton entry={entry}/>
                            </div>
                            <div style={{display: 'flex'}}>
                                <CopyPotTextButton entry={entry}/>
                                {showFull &&
                                    <CopyLinkToRaflPotButton entry={entry}/>
                                }
                            </div>
                        </div>
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
