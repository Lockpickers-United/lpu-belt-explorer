import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import CopyLinkToRaflPotButton from '../CopyLinkToRaflPotButton.jsx'
import FieldValue from '../../entries/FieldValue'
import useWindowSize from '../../util/useWindowSize.jsx'
import RaffleContext from '../RaffleContext.jsx'
import DataContext from '../../context/DataContext.jsx'
import BeltStripe from '../../entries/BeltStripe.jsx'
import dayjs from 'dayjs'
import Typography from '@mui/material/Typography'
import StatusMenu from './StatusMenu.jsx'
import Tooltip from '@mui/material/Tooltip'
import DBContext from '../../app/DBContext.jsx'
import DeleteEntryButton from './DeleteEntryButton.jsx'
import EntryNotes from './EntryNotes.jsx'

function RaffleSubmittedEntry({entry, expanded, onExpand, setEditEntryId}) {

    const {raffleAdminRole} = useContext(RaffleContext)
    const {expandAll, statusLabels} = useContext(DataContext)
    const {updateRaffleEntry} = useContext(DBContext)

    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)

    useEffect(() => {
        if (expanded && ref && !scrolled && !expandAll) {
            console.log('entry', entry)
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

    const isUpdated = dayjs(entry?.updatedAt).valueOf() - dayjs(entry?.createdAt).valueOf() > 60000

    const approveDonationToggle = useCallback((donationIndex) => {
        if (!raffleAdminRole) return
        const updatedDonations = entry.donations.map((donation, index) => {
            if (index === donationIndex) {
                return {...donation, approved: !donation.approved}
            }
            return donation
        })
        const updatedEntry = {
            ...entry,
            donations: updatedDonations
        }
        updateRaffleEntry(updatedEntry)
            .then(() => {
                console.log('Donation approval toggled')
            })
            .catch(error => {
                console.error('Error updating donation approval:', error)
            })
    }, [entry, raffleAdminRole, updateRaffleEntry])


    const {isMobile} = useWindowSize()
    const titleMargin = !isMobile ? '12px 0px 8px 8px' : '12px 0px 8px 0px'
    const contentsFontSize = isMobile ? '0.95rem' : '1.0rem'
    const donationColors = {no: {backgroundColor: '#333', color: '#aaa'}, yes: {backgroundColor: '#aaa', color: '#fff'}}

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{
                '.MuiAccordionSummary-content': {
                    margin: '6px 0px'
                }
            }}>
                <BeltStripe value={statusLabels[entry.status].entryColor}/>
                <div style={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                    <div style={{display: 'block', marginBottom: 0, flexGrow: 1}}>
                        <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
                            <div style={{margin: titleMargin, display: 'flex', flexGrow: 1, fontWeight: 600}}>
                                {entry?.username}
                                &nbsp;<span
                                style={{fontWeight: 400, color: '#777'}}>({entry.platform.toLowerCase()})</span>
                            </div>
                            <FieldValue
                                name='Submitted'
                                value={<Typography
                                    style={{
                                        fontSize: '0.95rem',
                                        lineHeight: 1.25
                                    }}>{dayjs(entry?.createdAt).format('MMM DD')}</Typography>}
                                style={{marginRight: 20}}
                            />
                            <FieldValue
                                name='Updated'
                                value={<Typography
                                    style={{
                                        fontSize: '0.95rem',
                                        lineHeight: 1.25
                                    }}>{dayjs(entry?.updatedAt).format('MMM DD')}</Typography>}
                                textStyle={!isUpdated ? {color: '#777'} : {}}
                                style={{marginRight: 20}}
                            />
                            <FieldValue
                                name='Donations'
                                value={<Typography
                                    style={{
                                        fontSize: '0.95rem',
                                        lineHeight: 1.25
                                    }}>$ {Intl.NumberFormat().format(entry.totalDonation)}</Typography>}
                                textStyle={entry.totalDonation !== entry.allocatedTickets ? {color: '#f33'} : {}}
                                style={{marginRight: 20}}
                            />
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>

                    <AccordionDetails sx={{padding: '0px 16px 0px 16px', margin: '0px 10px'}}>

                        <div style={{textAlign: 'right', margin: '0px 0px 10px 0px', fontWeight: 700}}>
                            Entry Status &nbsp;<StatusMenu entry={entry}/>
                        </div>

                        <div style={{fontWeight: 700}}>Donations</div>
                        {entry.donations.map((donation, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                flexGrow: 1,
                                placeItems: 'center',
                                fontSize: contentsFontSize,
                                marginLeft: 10,
                                marginBottom: 4
                            }}>
                                <div style={{fontWeight: 500, marginBottom: 4, flexGrow: 1}}>
                                    {donation.charity?.itemFullTitle || donation.charity?.itemTitle || 'No Charity Selected'}
                                </div>
                                <div style={{marginBottom: 4, placeItems: 'center', display: 'flex'}}>
                                    {donation.receipt && <span>Receipt: <a href={donation.receipt} target='_blank'
                                                                           rel='noopener noreferrer'>{(donation.receipt.match(/^(?:https?:\/\/)?([^/?#]+)/i) || [])[1]}</a>&nbsp;&nbsp;</span>}
                                    {donation.amount > 0 &&
                                        <span style={{marginRight: 6}}>Donation: $ {Intl.NumberFormat().format(donation.amount)}</span>}
                                    <Button style={{
                                        minWidth: 20,
                                        padding: '0px 5px', ...donationColors[donation.approved ? 'yes' : 'no']
                                    }} onClick={() => approveDonationToggle(index)} variant='contained'>OK</Button>
                                </div>
                            </div>
                        ))}

                        <div style={{fontWeight: 700, marginTop: 10}}>Pots</div>
                        {entry.pots.map((pot, index) => (
                            <div key={index}
                                 style={{display: 'flex', flexGrow: 1, fontSize: contentsFontSize, marginLeft: 10}}>
                                <div style={{fontWeight: 500, marginBottom: 4, flexGrow: 1}}>
                                    {pot?.itemFullTitle || pot?.itemTitle || 'No Pot Selected'}
                                </div>
                                <div style={{marginBottom: 4}}>
                                    {pot?.tickets > 0 && <span style={{marginRight: 12}}>Tickets: {Intl.NumberFormat().format(pot.tickets)}</span>}
                                </div>
                            </div>
                        ))}

                        <EntryNotes entry={entry} containerRef={ref}/>

                        <div style={{textAlign: 'center', margin: '25px 0px 0px 0px'}}>
                            <Tooltip title='Edit Entry' arrow disableFocusListener>
                                <Button variant='contained' size='large'
                                        onClick={() => {
                                            setEditEntryId(entry.id)
                                        }}
                                        style={{
                                            backgroundColor: '#2bb259', color: '#000', padding: '6px 14px'
                                        }}>
                                    EDIT ENTRY
                                </Button>
                            </Tooltip>
                        </div>


                    </AccordionDetails>
                    <AccordionActions disableSpacing>
                        <div style={{display: 'flex', flexGrow: 1}}><DeleteEntryButton entry={entry} containerRef={ref}/></div>
                        <CopyLinkToRaflPotButton entry={entry}/>
                    </AccordionActions>


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
