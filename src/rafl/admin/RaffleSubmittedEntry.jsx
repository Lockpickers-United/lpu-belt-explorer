import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Tracker from '../../app/Tracker'
import CopyLinkToRaflPotButton from '../CopyLinkToRaflPotButton.jsx'
import FieldValue from '../../entries/FieldValue'
import FilterChip from '../../filters/FilterChip'
import RaffleImageGallery from '../RaffleImageGallery.jsx'
import CopyPotTextButton from '../CopyPotTextButton.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import FilterContext from '../../context/FilterContext.jsx'
import RaffleContext from '../RaffleContext.jsx'
import DataContext from '../../context/DataContext.jsx'
import BeltStripe from '../../entries/BeltStripe.jsx'
import dayjs from 'dayjs'
import Typography from '@mui/material/Typography'
import StatusMenu from './StatusMenu.jsx'
import Tooltip from '@mui/material/Tooltip'

function RaffleSubmittedEntry({entry, expanded, onExpand, single}) {

    const {raflState, raffleAdminRole} = useContext(RaffleContext)
    const {expandAll, statusColors} = useContext(DataContext)
    const showFull = ['live', 'post'].includes(raflState) || raffleAdminRole

    const {filters} = useContext(FilterContext)

    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)
    const showSimple = single === '2'


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
        onExpand && onExpand(isExpanded ? entry?.id : false)
    }, [entry?.id, onExpand])

    const isUpdated = dayjs(entry?.updatedAt).valueOf()-dayjs(entry?.createdAt).valueOf() > 60000

    const {isMobile, flexStyle} = useWindowSize()
    const titleMargin = !isMobile ? '12px 0px 8px 8px' : '12px 0px 8px 0px'
    const descriptionMargin = !isMobile ? '12px 0px 12px 8px' : '12px 0px 12px 0px'
    const contribMargin = !isMobile ? '0px 0px 18px 8px' : '0px 0px 18px 0px'
    const descriptionFontSize = isMobile ? '1rem' : '1.1rem'
    const contentsFontSize = isMobile ? '0.95rem' : '1.0rem'

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={!showSimple ? <ExpandMoreIcon/> : null} sx={{
                '.MuiAccordionSummary-content': {
                    margin: '6px 0px'
                }
            }}>
                <BeltStripe value={statusColors[entry.status]}/>
                <div style={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                    <div style={{display: 'block', marginBottom: 0, flexGrow: 1}}>
                        <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
                            <div style={{margin: titleMargin, display: 'flex', flexGrow: 1, fontWeight: 600}}>
                                {entry?.username}
                            </div>
                            <FieldValue
                                name='Submitted'
                                value={<Typography
                                    style={{
                                        fontSize: '0.95rem',
                                        lineHeight: 1.25
                                    }}>{dayjs(entry?.createdAt).format('YYYY-MM-DD')}</Typography>}
                                style={{marginRight:20}}
                            />
                            <FieldValue
                                name='Updated'
                                value={<Typography
                                    style={{
                                        fontSize: '0.95rem',
                                        lineHeight: 1.25
                                    }}>{dayjs(entry?.updatedAt).format('YYYY-MM-DD')}</Typography>}
                                textStyle={!isUpdated ? {color: '#777'} : {}}
                                style={{marginRight:20}}
                            />
                            <FieldValue
                                name='Donations'
                                value={<Typography
                                    style={{fontSize: '0.95rem', lineHeight: 1.25}}>$ {entry.totalDonation}</Typography>}
                                textStyle={entry.totalDonation !== entry.allocatedTickets ? {color: '#f33'} : {}}
                                style={{marginRight:20}}
                            />
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>

                    <AccordionDetails sx={{padding: '0px 16px 0px 16px', margin: '0px 10px'}}>

                        <div style={{fontWeight:700}}>Donations:</div>
                        {entry.donations.map((donation, index) => (
                            <div key={index} style={{display: 'flex', flexGrow: 1, fontSize: contentsFontSize, marginLeft: 10}}>
                                        <div style={{fontWeight: 500, marginBottom: 4, flexGrow: 1}}>
                                            {donation.charity?.itemFullTitle || donation.charity?.itemTitle || 'No Charity Selected'}
                                        </div>
                                        <div style={{marginBottom: 4}}>
                                            {donation.receipt && <span>Receipt: <a href={donation.receipt} target='_blank' rel='noopener noreferrer'>{(donation.receipt.match(/^(?:https?:\/\/)?([^/?#]+)/i) || [])[1]}</a>&nbsp;&nbsp;</span>}
                                            {donation.amount > 0 && <span style={{marginRight: 12}}>Donation: $ {donation.amount}</span>}
                                        </div>
                            </div>
                        ))}

                        <div style={{fontWeight:700, marginTop:10}}>Pots:</div>
                        {entry.pots.map((pot, index) => (
                            <div key={index} style={{display: 'flex', flexGrow: 1, fontSize: contentsFontSize, marginLeft: 10}}>
                                        <div style={{fontWeight: 500, marginBottom: 4, flexGrow: 1}}>
                                            {pot?.itemFullTitle || pot?.itemTitle || 'No Pot Selected'}
                                        </div>
                                        <div style={{marginBottom: 4}}>
                                            {pot?.tickets > 0 && <span style={{marginRight: 12}}>Tickets: {pot.tickets}</span>}
                                        </div>
                            </div>
                        ))}

                    </AccordionDetails>

                    {!showSimple &&
                        <AccordionActions disableSpacing>
                                <CopyLinkToRaflPotButton entry={entry}/>
                            <Tooltip title='Edit Entry' arrow disableFocusListener>
                                <Button variant='contained' size='small' color='warning'
                                        onClick={() => {}}
                                        style={{
                                            backgroundColor: '#3ba0e0', marginRight: 15
                                        }}>
                                    EDIT ENTRY
                                </Button>
                            </Tooltip>
                            <StatusMenu entry={entry}/>
                        </AccordionActions>
                    }
                </React.Fragment>
            }
        </Accordion>
    )
}

export default React.memo(RaffleSubmittedEntry, (prevProps, nextProps) => {
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
