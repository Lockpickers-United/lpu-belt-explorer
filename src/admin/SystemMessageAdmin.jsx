import React, {useCallback, useContext, useDeferredValue, useEffect, useMemo, useState} from 'react'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import DBContext from '../app/DBContext.jsx'
import SystemMessageRow from './systemMessageAdmin/SystemMessageRow.jsx'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import SystemMessagePreview from './systemMessageAdmin/SystemMessagePreview.jsx'
import AuthContext from '../app/AuthContext.jsx'
import {enqueueSnackbar} from 'notistack'

function SystemMessageAdmin() {
    usePageTitle('System Message Admin')

    const {user} = useContext(AuthContext)
    const {systemMessages, getAllSystemMessages, removeDismissedMessages} = useContext(DBContext)
    const [allMessages, setAllMessages] = useState([])
    const [expanded, setExpanded] = useState(null)
    const [controlsExpanded, setControlsExpanded] = useState(false)
    const [sort, setSort] = useState('status')
    const [filter, setFilter] = useState('recent')

    useEffect(() => {
        getAllSystemMessages().then(r => setAllMessages(r))
    }, [getAllSystemMessages, systemMessages])

    const filteredMessages = useMemo(() => allMessages.filter(message => {
        if (filter === 'all') {
            return true
        } else if (filter === 'active' && message.status === 'active') {
            return true
        } else return filter === 'recent' && ['active', 'pending', 'completed'].includes(message.status)
    }), [allMessages, filter])

    const sortedMessages = useMemo(() => filteredMessages?.sort((a, b) => {
        const statuses = ['active', 'pending', 'completed', 'archived']
        if (sort === 'priority') {
            return b.priority - a.priority
        } else if (sort === 'status') {
            return statuses.indexOf(a.status) - statuses.indexOf(b.status)
                || dayjs(b.modified).valueOf() - dayjs(a.modified).valueOf()
        } else {
            return dayjs(b.modified).valueOf() - dayjs(a.modified).valueOf()
        }
    }), [filteredMessages, sort])

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    const handleSort = useCallback(value => {
        setSort(value)
    }, [])

    const handleFilter = useCallback(value => {
        setFilter(value)
    }, [])

    const handleToggleControls = useCallback(() => {
        setControlsExpanded(!controlsExpanded)
    }, [controlsExpanded])

    const handleClearDismissed = useCallback( async () => {
        await removeDismissedMessages(user?.uid)
        enqueueSnackbar('Dismissed messages cleared.')
    }, [removeDismissedMessages, user])

    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const firstHeaderStyle = {margin: '0px 0px 20px 0px', width: '100%', textAlign: 'center', color: '#fff'}

    const newId = useMemo(() => {
        return Math.floor(Math.random() * 4294967296).toString(16)
    }, [])
    const newMessage = {
        id: newId,
        status: 'pending',
        description: 'new message',
        messageType: 'Neutral',
        'priority': 0,
        'messageHeadline': 'Hello!',
        'messageText': '',
        'pageIds': [],
        'excludePageIds': [],
        'targetAdminOnly': true,
        'targetLoggedIn': false,
        'targetBlackBeltsOnly': false,
        'noDismiss': false,
        'targetAnonymousNotOK': false,
        'targetCollectionUsersOnly': false,
        'targetUserIds': false
    }

    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>

            <div style={firstHeaderStyle}>
                System Message Admin<br/>
            </div>

            <SystemMessagePreview/>

            <div style={{width: 760, marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, display: 'flex'}}>
                <div style={{}}>
                    <span style={{fontSize: '.7rem', marginRight: 5}}>SORT</span>
                    <ToggleButtonGroup style={{height: 26, marginTop: 10}}>
                        <ToggleButton selected={sort === 'modified' || !sort} style={{padding: 7}} value={'name'}
                                      onClick={() => handleSort('modified')}>Modified</ToggleButton>
                        <ToggleButton selected={sort === 'priority'} style={{padding: 7}} value={'lock'}
                                      onClick={() => handleSort('priority')}>Priority</ToggleButton>
                        <ToggleButton selected={sort === 'status'} style={{padding: 7}} value={'lock'}
                                      onClick={() => handleSort('status')}>Status</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div style={{textAlign: 'right', flexGrow: 1}}>
                    <span style={{fontSize: '.7rem', marginRight: 5}}>FILTER</span>
                    <ToggleButtonGroup style={{height: 26, marginTop: 10}}>
                        <ToggleButton selected={filter === 'active'} style={{padding: 7}} value={'name'}
                                      onClick={() => handleFilter('active')}>Active</ToggleButton>
                        <ToggleButton selected={filter === 'recent'} style={{padding: 7}} value={'lock'}
                                      onClick={() => handleFilter('recent')}>Recent</ToggleButton>
                        <ToggleButton selected={filter === 'all'} style={{padding: 7}} value={'lock'}
                                      onClick={() => handleFilter('all')}>All</ToggleButton>
                    </ToggleButtonGroup>
                </div>

            </div>
            <Accordion expanded={controlsExpanded} disableGutters={false}
                       style={{width: 760, marginLeft: 'auto', marginRight: 'auto'}}>
                <AccordionSummary>
                    <div>
                        <Button variant='outlined' color='secondary' size='small'
                                style={{lineHeight: '1rem'}}
                                onClick={() => handleClearDismissed()}>
                            Clear&nbsp;My&nbsp;Dismissed
                        </Button>
                    </div>
                    <div style={{width: '100%', textAlign: 'right'}}>
                        {!controlsExpanded &&
                            <Button variant='outlined' color='secondary' size='small'
                                    style={{lineHeight: '1rem'}}
                                    onClick={() => handleToggleControls()}>
                                New Message
                            </Button>
                        }
                        {controlsExpanded &&
                            <Button variant='outlined' color='info' size='small'
                                    style={{lineHeight: '1rem'}}
                                    onClick={() => handleToggleControls()}>
                                Close New Message
                            </Button>
                        }
                    </div>
                </AccordionSummary>

                <AccordionDetails style={{backgroundColor: '#333', padding: 0}}>
                    {controlsExpanded &&
                        <SystemMessageRow message={newMessage} expanded={true}/>
                    }
                </AccordionDetails>
            </Accordion>

            {sortedMessages.map((message) =>
                <SystemMessageRow key={message.id} message={message}
                                onExpand={handleExpand}
                                expanded={message.id === defExpanded}
                                setControlsExpanded={setControlsExpanded}
                />
            )}

        </div>
    )
}

export default SystemMessageAdmin
