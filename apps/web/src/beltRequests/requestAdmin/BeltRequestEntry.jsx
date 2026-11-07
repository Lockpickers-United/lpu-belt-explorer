import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import BeltStripe from '../../entries/BeltStripe'
import {Collapse} from '@mui/material'
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
import DBContext from '../BeltRequestDBContext.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import CopyEntryIdButton from '../../entries/CopyEntryIdButton.jsx'
import ApproveDenyButton from './ApproveDenyButton.jsx'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import ImgurEmbed from '../../misc/ImgurEmbed.jsx'
import YouTubeIcon from '@mui/icons-material/YouTube'
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

function BeltRequestEntry({entry, expanded, onExpand}) {
    const {
        profile,
        handleUpdate
    } = useContext(DBContext)
    const {isMobile} = useWindowSize()
    const [showDetails, setShowDetails] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const ref = useRef(null)

    const {
        status,
        displayStatus,
        dateAdded,
        id,
        belt,
        username,
        source,
        platform,
        messageContent,
        messageId,
        checkoutBy,
        attachments,
        _reply,
        _syncUsername,
        _syncTo,
        _userId,
        _requestId,
        _updatedAt,
        _lastUpdateBy,
        _updateMessageId,
        _reviewerId,
        _fuzzy
    } = entry

    const [processing, setProcessing] = useState(undefined)

    const handleClick = useCallback(async (request, action, event, force = false) => {
        event && event.stopPropagation()
        event && event.preventDefault()
        if (processing) return
        setProcessing(action)
        handleClose()
        await handleUpdate(request, action, force)
        setTimeout(() => setProcessing(undefined), 100)
    }, [handleClose, handleUpdate, processing])

    const handleReply = useCallback(async (action, replyText, event) => {
        const requestReply = {...entry, reply: replyText}
        await handleClick(requestReply, action, event)
    }, [entry, handleClick])

    const parsed = parseBeltRequest(messageContent)
    const evidence = parsed.evidence ?? messageContent
    const evidenceMd = evidence
        ? evidence.replaceAll(/(https*:\/\/)(\S+)/g, (_match, p1, p2) => {
            return `[${truncate(p2, isMobile ? 35 : 55)}](${p1 + p2})`
        })
        : ''

    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g
    const matches = [...messageContent.matchAll(youtubeRegex)]
    const videoLinks = matches.map(match => match[0])
    const videoIds = matches.map(match => match[1])

    const imgurMatches = [...messageContent.matchAll(/(?:https?:\/\/)?(?:www\.)?imgur.com\/a\/([a-zA-Z0-9_-]{7})/g)]
    const imgurIds = imgurMatches.map(match => match[1])

    const attachmentIcon = attachments?.length > 0 ? ' 📎' : ''

    const openInNewTab = useCallback((e) => {
        e.stopPropagation()
        const links = {
            Discord: `https://discord.com/channels/140129091796992000/282173282546089985/${messageId}`,
            lock: `https://lpubelts.com/#/locks?tab=search&search=${id}&id=${id}}`
        }
        window.open(links[platform], '_blank', 'noopener,noreferrer')
    }, [id, messageId, platform])

    const toggleExpand = useCallback((_, isExpanded) => {
        setShowDetails(false)
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

    const myCheckout = status === 'checked-out' && checkoutBy === profile.displayName
    const handleShowDetails = useCallback(() => {
        setShowDetails(prev => !prev)
    }, [])

    const columns = [
        {id: 'field', align: 'right', name: 'Field'},
        {id: 'value', align: 'left', name: 'Value'}
    ]
    const rows = Object.entries(entry).map(([key, value]) => {
        if (['fuzzy'].includes(key)) return null
        return {field: key, value: value}
    }).filter(row => row !== null)

    const tableData = {columns, rows, sortable: false, wrap: false}
    const linkFunction = useCallback((_columnId, string, _linkUrl) => {
        return string
    }, [])

    const sidePadding = !isMobile ? '16px' : '4px'

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#222'}
    return (
        <Accordion expanded={expanded} onChange={toggleExpand} style={style} ref={ref} disableGutters
                   slots={{heading: 'div'}} role='listitem' aria-label={username}>
            <AccordionSummary component='div'
                              nativeButton={false}
                              expandIcon={<ExpandMoreIcon/>}
                              sx={{boxShadow: 3, '.MuiAccordionSummary-content': {alignItems: 'center'}}}>
                <BeltStripe value={belt}/>
                <div style={{
                    margin: `0px ${sidePadding}`,
                    padding: '4px 0',
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    width: '100%',
                    flexWrap: 'wrap'
                }}>
                    <div style={{flexGrow: 1}}>
                        <div style={{
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            marginBottom: 2,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <span>{username}</span>&nbsp;<span
                            style={{fontWeight: 400, marginRight: 16}}> • {belt}</span>
                            {videoLinks.length > 0 &&
                                <YouTubeIcon style={{marginLeft: 8, color: '#ff7474'}}/>
                            }
                            {(imgurIds.length > 0 || attachments?.length > 0) &&
                                <PhotoSizeSelectActualIcon fontSize='12pt' style={{marginLeft: 8, color: '#7badd0'}}/>
                            }
                        </div>
                        <div style={{fontSize: '0.9rem', fontWeight: 400, color: '#ccc', marginBottom: 4}}>
                            {dayjs(dateAdded).format('YYYY-MM-DD')} ({source} - {id})
                        </div>
                        <div style={{fontSize: '0.9rem', fontWeight: 400, color: '#ddd'}}>
                            <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}
                                           remarkPlugins={[remarkGfm]}
                                           components={{p: 'div'}}
                            >
                                {evidenceMd + attachmentIcon}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <div style={{flexGrow: 1, alignItems: 'center', display: 'flex', justifyContent: 'flex-end'}}>

                        {(status === 'open' || myCheckout) &&
                            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '8px 0px'}}>
                                {myCheckout &&
                                    <Button onClick={(e) => handleClick(entry, 'checkin', e)}
                                            disabled={processing}
                                            variant='text' color='info' style={{flexGrow: 0}}>
                                        {processing !== 'checkin' ? 'Check In' :
                                            <LoadingDisplay size={20} white={true}/>}
                                    </Button>
                                }

                                <ApproveDenyButton entry={entry} action={'approve'} handleReply={handleReply}
                                                   processing={processing}/>
                                <ApproveDenyButton entry={entry} action={'deny'} handleReply={handleReply}
                                                   processing={processing}/>

                            </div>
                        }
                        {status !== 'open' && !myCheckout &&
                            <div style={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                margin: '8px 0px'
                            }}>
                                <div style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: !['checked-out', 'processing-approve', 'processing-deny'].includes(status) ? '#ddd' : '#4d7ce3'
                                }}>
                                    {displayStatus}{checkoutBy && ` by ${checkoutBy}`}&nbsp;
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div style={{marginRight: 0, alignContent: 'center', minWidth: 40}}>
                    {platform === 'Discord' && messageId &&
                        <IconButton onClick={(e) => openInNewTab(e)} style={{height: 40}}>
                            <OpenInNewIcon style={{color: '#ccc'}}/>
                        </IconButton>
                    }
                </div>
            </AccordionSummary>
            {expanded &&
                <AccordionDetails sx={{padding: `12px ${sidePadding}`, backgroundColor: '#222'}}>
                    <BeltStripe value={belt}/>
                    <div style={{
                        margin: `0px ${sidePadding}`,
                        padding: '0px 4px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'top',
                        justifyContent: 'space-between',
                        width: '100%',
                        flexWrap: 'wrap-reverse'
                    }}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <div><CopyEntryIdButton entry={entry}/></div>
                            <div>
                                <Button onClick={handleShowDetails} variant='text'
                                        style={{color: '#4d7ce3', marginRight: 16}}>
                                    {showDetails ? 'HIDE' : 'SHOW'} DETAILS</Button>
                                <Collapse in={showDetails} unmountOnExit>
                                    <DataTableSort
                                        tableData={tableData} tableWidth={310}
                                        linkFunction={linkFunction} linkColumnId={null}
                                        largeFontSize={'0.85rem'}/>
                                </Collapse>
                            </div>
                        </div>
                        <div>
                            <div style={{flexGrow: 1, flexDirection: 'row', textAlign: 'right', marginRight: 24}}>
                                {status === 'checked-out' && !myCheckout
                                    ? <>
                                        <Button onClick={handleOpen} variant='text'
                                                color='warning' style={{flexGrow: 0, marginRight: 16}}>
                                            Force...</Button>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            slotProps={{
                                                paper: {
                                                    sx: {
                                                        minWidth: 140,
                                                        maxWidth: '100%'
                                                    }
                                                }
                                            }}
                                        >
                                            {status === 'checked-out'
                                                ?
                                                <MenuItem onClick={(e) => handleClick(entry, 'checkin', e, true)}>
                                                    <ListItemText>Check In</ListItemText>
                                                </MenuItem>
                                                : null
                                            }
                                            <MenuItem onClick={(e) => handleClick(entry, 'approve', e, true)}>
                                                Approve
                                            </MenuItem>
                                            <MenuItem onClick={(e) => handleClick(entry, 'deny', e, true)}>
                                                Deny
                                            </MenuItem>
                                            <MenuItem onClick={(e) => handleClick(entry, 'delete', e, true)}
                                                      style={{color: '#ff3535'}}>
                                                Delete
                                            </MenuItem>
                                        </Menu>
                                    </>
                                    : <>
                                        <Button onClick={(e) => handleClick(entry, 'delete', e)}
                                                disabled={['processing-approve', 'processing-deny'].includes(status) || processing}
                                                variant='text'
                                                color='error'
                                                style={{flexGrow: 0, marginRight: 16}}>
                                            {processing !== 'deleted' ? 'Delete' :
                                                <LoadingDisplay size={20} white={true}/>}
                                        </Button>
                                        {!['open', 'checked-out'].includes(status) && !myCheckout &&
                                            <Button onClick={(e) => handleClick(entry, 'reopen', e)}
                                                    disabled={['open', 'checked-out', 'processing-approve', 'processing-deny'].includes(status) || processing}
                                                    variant='text' color='success'
                                                    style={{flexGrow: 0, marginRight: 16}}>
                                                {processing !== 'reopen' ? 'Re-open' :
                                                    <LoadingDisplay size={20} white={true}/>}
                                            </Button>
                                        }
                                    </>
                                }
                                {['open'].includes(status) &&
                                    <Button onClick={(e) => handleClick(entry, 'checkout', e)}
                                            variant='text' color='info' style={{flexGrow: 0}}>
                                        {processing !== 'checkout' ? 'Check Out' :
                                            <LoadingDisplay size={20} white={true}/>}
                                    </Button>
                                }
                                {myCheckout && false &&
                                    <Button onClick={(e) => handleClick(entry, 'checkin', e)}
                                            disabled={processing?.length > 0}
                                            variant='text' color='info' style={{flexGrow: 0}}>
                                        {processing !== 'checkin' ? 'Check In' :
                                            <LoadingDisplay size={20} white={true}/>}
                                    </Button>
                                }
                            </div>

                        </div>
                    </div>

                    <div style={{marginLeft: 12}}>
                        {attachments?.length > 0 &&
                            <div style={{width: '95%', padding: `8px ${sidePadding}`, marginRight: 16}}>
                                <div style={{fontWeight: 600, marginBottom: 2}}>Attachments</div>
                                {attachments.map((url, index) =>
                                    <Link href={url.toString()} key={index} target="_blank">
                                        <Box
                                        component="img"
                                        key={index}
                                        src={url}
                                        alt="A beautiful house"
                                        sx={{
                                            width: '100%',
                                            maxWidth: { xs: 350, sm: 700 },
                                            height: 'auto',
                                            borderRadius: 2,
                                            boxShadow: 3,
                                            objectFit: 'cover',
                                        }}
                                    />
                                    </Link>
                                )}
                            </div>
                        }

                        {videoIds.length > 0 &&
                            <div style={{width: '95%', padding: `8px ${sidePadding}`, marginRight: 16}}>
                                <div style={{fontWeight: 600, marginBottom: 2}}>YouTube</div>
                                {videoIds.map((id, index) =>
                                    <LiteYouTubeEmbed
                                        key={index}
                                        id={id}
                                        title={`Video #${index}`}
                                        lazyLoad={true}
                                    />
                                )}
                            </div>
                        }

                        {imgurIds.length > 0 &&
                            <div style={{width: '95%', padding: `8px ${sidePadding}`}}>
                                <div style={{fontWeight: 600, marginBottom: 2}}>Imgur</div>
                                {imgurIds.map((id, index) =>
                                    <ImgurEmbed imageId={id} key={index}/>
                                )}
                            </div>
                        }
                    </div>
                </AccordionDetails>
            }
        </Accordion>
    )
}

export default React.memo(BeltRequestEntry)
