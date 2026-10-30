import React, {useCallback, useRef, useState} from 'react'
import BeltStripe from '../../entries/BeltStripe'
import {useTheme} from '@mui/material'
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
import ProjectEvidenceButton from '../../projectsQuests/ProjectEvidenceButton.jsx'
import isValidUrl from '../../util/isValidUrl.js'
import Link from '@mui/material/Link'

function BeltRequestEntry({entry, expanded, onExpand}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
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
        fuzzy
    } = entry

    const {notes, evidence, syncMatch} = parseBeltRequest(messageContent)

    const openInNewTab = useCallback(() => {
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

    const doNothing = useCallback(() => {
    }, [])

    const columns = [
        {id: 'field', align: 'right', name: 'Field'},
        {id: 'value', align: 'left', name: 'Value'},
    ]
    const rows = Object.entries(entry).map(([key, value]) => ({field: key, value: value}))
    const tableData = {columns, rows, sortable: false, wrap: false}
    const linkFunction = useCallback((_columnId, string, _linkUrl) => {
        return string
    }, [])

    const {isMobile} = useWindowSize()

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#222'}
    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref} slots={{heading: 'div'}}
                   role='listitem' aria-label={username} disableGutters>
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
                        <div style={{fontSize: '1.2rem', fontWeight: 500}}>{username}</div>
                        <div style={{fontSize: '1.1rem', fontWeight: 500, color: '#ddd'}}>{belt}</div>
                        <div style={{fontSize: '0.9rem', fontWeight: 400, color: '#ccc'}}>
                            {dayjs(dateAdded).format('YYYY-MM-DD')} ({source})
                        </div>
                        <div style={{fontSize: '0.9rem', fontWeight: 400, color: '#ddd'}}>
                            <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}
                                           remarkPlugins={[remarkGfm]}
                                           components={{p: 'div'}}
                            >
                                {evidence}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => {
                        }} variant='text' size='small'
                                style={{color: '#20b924', marginRight: 8}}>Approve</Button>
                        <Button onClick={() => {
                        }} variant='text' size='small'
                                style={{color: '#e16936'}}>Deny</Button>
                    </div>

                </div>
                <div style={{marginRight: 0, alignContent: 'center'}}>
                    <IconButton onClick={openInNewTab} style={{height: 40}}>
                        <OpenInNewIcon style={{color: '#ccc'}}/>
                    </IconButton>
                </div>
            </AccordionSummary>
            <AccordionDetails sx={{padding: '8px 16px 0px 16px', backgroundColor: '#222'}}>
                <BeltStripe value={belt}/>
                <div style={{
                    margin: '0px 16px',
                    padding: '4px 0',
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'flex-start',
                    justifyContent: 'space-between',
                    width: '100%',
                    flexWrap: 'wrap'
                }}>
                    <DataTableSort
                        tableData={tableData} tableWidth={305}
                        linkFunction={linkFunction} linkColumnId={'evidenceUrl'}
                        largeFontSize={'0.85rem'}/>

                    <div style={{}}>
                        <Button onClick={doNothing} variant='text' size='small'
                                style={{color: '#20b924', marginRight: 8}}>
                            Re-Open</Button>
                        <Button onClick={doNothing} variant='text' size='small'
                                style={{color: '#e16936', flexGrow: 0}}>
                            Delete</Button>
                        <Button onClick={doNothing} variant='text' size='small'
                                style={{color: '#e16936', flexGrow: 0}}>
                            Review</Button>
                    </div>

                </div>

            </AccordionDetails>

        </Accordion>
    )
}

export default React.memo(BeltRequestEntry)
