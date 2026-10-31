import React, {useCallback, useEffect, useRef, useState} from 'react'
import BeltStripe from '../../entries/BeltStripe'
import {Collapse, useTheme} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import dayjs from 'dayjs'
import AccordionSummary from '@mui/material/AccordionSummary'
import Accordion from '@mui/material/Accordion'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import parseBeltRequest from './parseBeltRequest.js'
import Button from '@mui/material/Button'
import useWindowSize from '../../util/useWindowSize.jsx'
import AccordionDetails from '@mui/material/AccordionDetails'
import DataTableSort from '../../misc/DataTableSort.jsx'
import {truncate} from '../../util/stringUtils.js'
import queryString from 'query-string'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import ListItemText from '@mui/material/ListItemText'

function BeltRequestEntry({entry, expanded, onExpand}) {
    const {isMobile} = useWindowSize()
    const theme = useTheme()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const ref = useRef(null)

    const {
        status,
        dateAdded,
        id,
        belt,
        username,
        source,
        platform,
        messageContent,
        syncUsername,
        syncTo,
        userId,
        messageId,
        requestId,
        updatedAt,
        lastUpdateBy,
        updateMessageId,
        reviewerName,
        reviewerId,
        fuzzy
    } = entry

    const [showDetails, setShowDetails] = useState(false)

    const {notes, evidence, syncMatch} = parseBeltRequest(messageContent)

    const evidenceMd = evidence
        ? evidence.replaceAll(/(https*:\/\/)(\S+)/g, (_match, p1, p2) => {
            return `[${truncate(p2, isMobile ? 35 : 55)}](${p1 + p2})`
        })
        : ''

    const openInNewTab = useCallback((e) => {
        e.stopPropagation()
        const links = {
            Discord: `https://discord.com/channels/140129091796992000/282173282546089985/${messageId}`,
            lock: `https://lpubelts.com/#/locks?tab=search&search=${id}&id=${id}}`
        }
        const newWindow = window.open(links[source], '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [id, messageId, source])

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? entry.id : false)
    }, [entry, onExpand])

    useEffect(() => {
        if (expanded && ref && !scrolled) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 100
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === entry.id

            setScrolled(true)

            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: ref?.current?.offsetTop - offset,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        } else if (!expanded) {
            setScrolled(false)
        }
    }, [expanded, entry, scrolled])

    const doNothing = useCallback(() => {
    }, [])

    const handleShowDetails = useCallback(() => {
        setShowDetails(prev => !prev)
    }, [])

    const columns = [
        {id: 'field', align: 'right', name: 'Field'},
        {id: 'value', align: 'left', name: 'Value'}
    ]
    const rows = Object.entries(entry).map(([key, value]) => {
        if (['messageContent'].includes(key)) return null
        return {field: key, value: value}
    }).filter(row => row !== null)

    const tableData = {columns, rows, sortable: false, wrap: false}
    const linkFunction = useCallback((_columnId, string, _linkUrl) => {
        return string
    }, [])

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#222'}
    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}
                   slots={{heading: 'div'}} role='listitem' aria-label={username}
                   sx={{
                       '&.Mui-expanded': {marginTop: '6px', marginBottom: '6px'}
                   }}>
            <AccordionSummary component='div'
                              nativeButton={false}
                              expandIcon={<ExpandMoreIcon/>}
                              sx={{'.MuiAccordionSummary-content': {alignItems: 'center'}}}>
                <BeltStripe value={belt}/>
                <div style={{
                    margin: '0px 16px',
                    padding: '4px 0',
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    width: '100%',
                    flexWrap: 'wrap'
                }}>
                    <div style={{flexGrow: 1}}>
                        <div style={{fontSize: '1.2rem', fontWeight: 500}}>
                            {username}
                        </div>
                        <div style={{fontSize: '1.1rem', fontWeight: 500, color: '#ddd'}}>
                            {belt}
                        </div>
                        <div style={{fontSize: '0.9rem', fontWeight: 400, color: '#ccc'}}>
                            {dayjs(dateAdded).format('YYYY-MM-DD')} ({source})
                        </div>
                        <div style={{fontSize: '0.9rem', fontWeight: 400, color: '#ddd'}}>
                            <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}
                                           remarkPlugins={[remarkGfm]}
                                           components={{p: 'div'}}
                            >
                                {evidenceMd}
                            </ReactMarkdown>
                        </div>
                    </div>
                    {status === 'Open' &&
                        <div style={{display: 'flex', justifyContent: 'flex-end', margin: '8px 0px'}}>
                            <Button variant='text'
                                    style={{color: '#20b924', flexGrow: 0, marginRight: 8}}>Approve</Button>
                            <Button variant='text'
                                    style={{color: '#e16936', flexGrow: 0}}>Deny</Button>
                        </div>
                    }
                    {status !== 'Open' &&
                        <div style={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '8px 0px'
                        }}>
                            <div style={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: status !== 'Checked Out' ? '#ddd' : '#4d7ce3'
                            }}>
                                {status}{reviewerName && ` by ${reviewerName}`}
                            </div>
                        </div>
                    }
                </div>
                <div style={{marginRight: 0, alignContent: 'center'}}>
                    <IconButton onClick={(e) => openInNewTab(e)} style={{height: 40}}>
                        <OpenInNewIcon style={{color: '#ccc'}}/>
                    </IconButton>
                </div>
            </AccordionSummary>

            <AccordionDetails sx={{padding: '16px 16px 16px 16px', backgroundColor: '#222'}}>
                <BeltStripe value={belt}/>
                <div style={{
                    margin: '0px 16px',
                    padding: '4px 0',
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'flex-start',
                    justifyContent: 'space-between',
                    width: '100%',
                    flexWrap: 'wrap-reverse'
                }}>

                    <div>
                        <Button onClick={handleShowDetails} variant='text'
                                style={{color: '#4d7ce3', marginRight: 16}}>
                            {showDetails ? 'HIDE' : 'SHOW'} DETAILS</Button>
                        <Collapse in={showDetails}>
                            <DataTableSort
                                tableData={tableData} tableWidth={310}
                                linkFunction={linkFunction} linkColumnId={null}
                                largeFontSize={'0.85rem'}/>
                        </Collapse>
                    </div>

                    <div style={{flexGrow: 1, flexDirection: 'row', textAlign: 'right', marginRight: 24}}>
                        {status === 'Checked Out'
                            ? <>
                                <Button onClick={handleOpen} variant='text'
                                        color='info' style={{flexGrow: 0, marginRight: 16}}>
                                    Force...</Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    {status === 'Checked Out'
                                        ?
                                        <MenuItem onClick={handleClose}><ListItemText>Check In</ListItemText></MenuItem>
                                        : null
                                    }
                                    <MenuItem onClick={handleClose}>Approve</MenuItem>
                                    <MenuItem onClick={handleClose}>Deny</MenuItem>
                                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                                </Menu>
                            </>
                            : <>
                                <Button onClick={doNothing} variant='text' disabled={status === 'Deleted'}
                                        style={{
                                            color: status === 'Deleted' ? '#666' : '#ff0000',
                                            flexGrow: 0,
                                            marginRight: 16
                                        }}>
                                    Delete</Button>
                                <Button onClick={doNothing} variant='text'
                                        disabled={['Open', 'Checked Out'].includes(status)}
                                        color='success' style={{flexGrow: 0, marginRight: 16}}>
                                    Re-Open</Button>
                            </>
                        }
                        {['Open', 'Checked Out'].includes(status) &&
                            <Button onClick={doNothing} variant='text'
                                    disabled={['Checked Out'].includes(status)}
                                    color='success' style={{flexGrow: 0}}>
                                Check Out</Button>
                        }
                    </div>

                </div>

            </AccordionDetails>

        </Accordion>
    )
}

export default React.memo(BeltRequestEntry)
