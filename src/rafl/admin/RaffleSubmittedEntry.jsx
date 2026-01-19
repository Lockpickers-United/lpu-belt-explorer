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
import ListAltIcon from '@mui/icons-material/ListAlt'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import FilterContext from '../../context/FilterContext.jsx'
import {useNavigate} from 'react-router-dom'

function RaffleSubmittedEntry({entry, expanded, onExpand, setEditEntryId}) {

    const {raffleAdminRole} = useContext(RaffleContext)
    const {expandAll, statusLabels} = useContext(DataContext)
    const {updateRaffleEntry} = useContext(DBContext)
    const navigate = useNavigate()

    const {filters: allFilters} = useContext(FilterContext)
    const {sort} = allFilters || {}

    const [scrolled, setScrolled] = useState(false)
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)

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

    const isUpdated = dayjs(entry?.updatedAt).valueOf() - dayjs(entry?.createdAt).valueOf() > 60000

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    const goToPage = useCallback((page) => {
        navigate(page)
    }, [navigate])

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


    const {isMobile, flexStyle} = useWindowSize()
    const titleMargin = !isMobile ? '12px 0px 8px 8px' : '12px 0px 8px 0px'
    const contentsFontSize = isMobile ? '0.95rem' : '1.0rem'
    const detailsMarginLeft = isMobile ? 2 : 10
    const donationColors = {no: {backgroundColor: '#333', color: '#aaa'}, yes: {backgroundColor: '#aaa', color: '#fff'}}

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{
                '.MuiAccordionSummary-content': {
                    margin: '6px 0px'
                }
            }}>
                <BeltStripe value={statusLabels[entry.status].entryColor}/>
                <div style={{display: flexStyle, alignItems: 'center', flexGrow: 1}}>
                    <div style={{margin: titleMargin, display: 'flex', flexGrow: 1,
                        fontWeight: 600, color: entry.potsWon?.length > 0 ? '#2bb259' : '#fff'}}>
                        {entry?.username}
                        &nbsp;<span
                        style={{fontWeight: 400, color: '#777', marginLeft:8}}>({entry.platform.toLowerCase()})</span>
                        {entry.potsWon?.length > 0 &&
                            <span
                                style={{fontWeight: 600, color: '#2bb259', marginLeft:12}}>Winner</span>
                        }
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <FieldValue
                            name='Submitted'
                            value={<Typography
                                style={{
                                    fontSize: '0.95rem',
                                    lineHeight: 1.25
                                }}>{dayjs(entry?.createdAt).format('MMM DD')}</Typography>}
                            style={{marginRight: 20}}
                        />
                        {sort === 'updatedAt' &&
                            <FieldValue
                                name='Updated'
                                value={<Typography
                                    style={{
                                        fontSize: '0.95rem',
                                        lineHeight: 1.25
                                    }}>{dayjs(entry?.updatedAt).format('MMM DD')}</Typography>}
                                textStyle={!isUpdated ? {color: '#777'} : {}}
                                style={{marginRight: 30}}
                            />
                        }
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
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>

                    <AccordionDetails sx={{padding: '0px 16px 0px 16px', margin: '0px 10px'}}>

                        <div style={{textAlign: 'right', margin: '0px 0px 10px 0px', fontWeight: 700}}>
                            Entry Status &nbsp;<StatusMenu entry={entry}/>
                        </div>

                        <div style={{fontWeight: 500, fontSize:'0.8rem'}}>DONATIONS</div>
                        {entry.donations.map((donation, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                flexGrow: 1,
                                alignItems: 'center',
                                fontSize: contentsFontSize,
                                marginLeft: detailsMarginLeft,
                                marginBottom: 4
                            }}>
                                <div style={{fontWeight: 500, flexGrow: 1}}>
                                    {donation.charity?.itemFullTitle || donation.charity?.itemTitle || 'No Charity Selected'}
                                </div>
                                {!isMobile
                                    ? <div style={{display: 'flex'}}>
                                        {donation.receipt && <span>Receipt: <Link
                                            style={{color: '#ccc', textDecoration: 'underline', cursor: 'pointer'}}
                                            onClick={() => openInNewTab(donation.receipt)}>{(donation.receipt.match(/^(?:https?:\/\/)?([^/?#]+)/i) || [])[1]}</Link>&nbsp;&nbsp;</span>}
                                        {donation.amount > 0 &&
                                            <span
                                                style={{marginRight: 6}}>Donation: $ {Intl.NumberFormat().format(donation.amount)}</span>}
                                    </div>
                                    : <Tooltip title='My Collection' arrow disableFocusListener>
                                        <IconButton
                                            variant='outlined'
                                            color='inherit'
                                            onClick={() => openInNewTab(donation.receipt)}
                                            style={{marginRight: 10}}
                                        >
                                            <ListAltIcon fontSize='small'/>
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Button style={{
                                    minWidth: 20,
                                    padding: '0px 5px', ...donationColors[donation.approved ? 'yes' : 'no']
                                }} onClick={() => approveDonationToggle(index)} variant='contained'>OK</Button>

                            </div>
                        ))}

                        <div style={{fontWeight: 500, fontSize:'0.8rem', marginTop: 10}}>POTS</div>
                        {entry.pots.map((pot, index) => (
                            <div key={index}
                                 style={{display: 'flex', flexGrow: 1, fontSize: contentsFontSize, marginLeft: 10}}>
                                <div style={{fontWeight: 500, marginBottom: 4, flexGrow: 1}}>
                                    <Link style={{color: '#fff', textDecoration: 'none', cursor: 'pointer'}}
                                          onClick={() => goToPage(`/rafl/?id=${pot.itemId}`)}>
                                        {pot?.itemFullTitle || pot?.itemTitle || 'No Pot Selected'}
                                    </Link>
                                    {pot.winner && (
                                        <Link
                                            style={{color: '#2bb259', fontWeight: 700, marginLeft: 12}}
                                            onClick={() => goToPage(`/rafl/?id=${pot.itemId}`)}>Winner</Link>
                                    )}
                                </div>
                                <div style={{marginBottom: 4}}>
                                    {pot?.tickets > 0 && <span
                                        style={{marginRight: 12}}>Tickets: {Intl.NumberFormat().format(pot.tickets)}</span>}
                                </div>
                            </div>
                        ))}

                        <EntryNotes entry={entry} containerRef={ref}/>

                        <div style={{fontSize: '0.9rem', fontWeight: 400, marginTop: 10, textAlign: 'right'}}>
                            Last updated: {dayjs(entry?.updatedAt).format('MMM DD')}
                        </div>

                        <div style={{textAlign: 'center', margin: '15px 0px 5px 0px'}}>
                            <Tooltip title='Edit Entry' arrow disableFocusListener>
                                <Button variant='contained' size='small'
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
                        <div style={{display: 'flex', flexGrow: 1}}><DeleteEntryButton entry={entry}
                                                                                       containerRef={ref}/></div>
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
