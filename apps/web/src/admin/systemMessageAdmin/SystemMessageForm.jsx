import React, {useCallback, useContext} from 'react'
import TextField from '@mui/material/TextField'
import DBContext from '../../app/DBContext.jsx'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch'
import MenuItem from '@mui/material/MenuItem'
import Link from '@mui/material/Link'
import Checkbox from '@mui/material/Checkbox'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {enqueueSnackbar} from 'notistack'

dayjs.extend(utc)

export default function SystemMessageForm({message, temp, setTemp, updated, setUpdated}) {
    const {updateSystemMessage} = useContext(DBContext)

    const handleSave = useCallback(async () => {
        const dt = dayjs().utc().format()
        setTemp({...temp, modified: dt})
        await updateSystemMessage(temp)
        enqueueSnackbar('Message changes saved.')
        setUpdated(false)
    }, [setTemp, setUpdated, temp, updateSystemMessage])

    const handleCancel = useCallback(() => {
        if (updated) {
            setTemp(message)
            setUpdated(false)
        }
    }, [updated, setTemp, message, setUpdated])

    const handleToggle = useCallback((field) => {
        setTemp({...temp, [field]: !temp[field]})
        setUpdated(true)
    }, [setTemp, setUpdated, temp])

    const saveEntryColor = updated ? '#fff' : '#555'
    const cancelColor = updated ? '#e15c07' : '#555'
    const linkLaunchColor = temp.linkDestination?.length > 0 ? '#fff' : '#666'

    return (
        <div style={{display: 'block', width: '100%'}}>
            <div style={{display: 'flex', marginBottom: 10}}>
                <TextField
                    select
                    style={{width: 280}}
                    id='messageType'
                    label='Message Type'
                    value={temp.messageType}
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setTemp({...temp, messageType: e.target.value})
                        setUpdated(true)
                    }}
                >
                    <MenuItem value='Good News'>Good News</MenuItem>
                    <MenuItem value='Info'>Info</MenuItem>
                    <MenuItem value='Alert'>Alert</MenuItem>
                    <MenuItem value='Neutral'>Neutral</MenuItem>
                    <MenuItem value='Pink'>Pink</MenuItem>
                </TextField>
                <TextField
                    id='priority'
                    label='Priority'
                    value={temp.priority}
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setTemp({...temp, priority: e.target.value})
                        setUpdated(true)
                    }}
                    style={{marginLeft: 10}}
                />
                <TextField
                    id='description'
                    label='Description'
                    value={temp.description}
                    fullWidth
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setTemp({...temp, description: e.target.value})
                        setUpdated(true)
                    }}
                    style={{marginLeft: 10}}
                />
            </div>

            <TextField
                id='messageHeadline'
                label='Headline'
                value={temp.messageHeadline}
                fullWidth
                size='small'
                margin='dense'
                color='secondary'
                onChange={e => {
                    setTemp({...temp, messageHeadline: e.target.value})
                    setUpdated(true)
                }}
                style={{marginBottom: 10}}
            />
            <TextField
                id='messageText'
                label='Message Text'
                value={temp.messageText}
                multiline
                rows={3}
                fullWidth
                size='small'
                margin='dense'
                color='secondary'
                onChange={e => {
                    setTemp({...temp, messageText: e.target.value})
                    setUpdated(true)
                }}
                style={{marginBottom: 10}}
            />
            <div style={{display: 'flex', marginBottom: 10}}>
                <TextField
                    id='linkText'
                    label='Link Text'
                    value={temp.linkText}
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setTemp({...temp, linkText: e.target.value})
                        setUpdated(true)
                    }}
                />
                <TextField
                    id='linkDestination'
                    label='Link Destination'
                    value={temp.linkDestination}
                    fullWidth
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setTemp({...temp, linkDestination: e.target.value})
                        setUpdated(true)
                    }}
                    style={{marginLeft: 10}}
                />
                <IconButton disabled={temp.linkDestination?.length === 0}>
                    <a href={'https://lpubelts.com/#' + temp.linkDestination} target='_blank' rel='noreferrer'>
                        <LaunchIcon style={{fontSize: 'large', color: linkLaunchColor}}/></a>
                </IconButton>
            </div>
            <div style={{display: 'flex', marginBottom: 10}}>
                <TextField
                    id='pageIds'
                    label='Page Ids'
                    value={temp.pageIds}
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        const pageArray = e.target.value.split(',')
                        setTemp({...temp, pageIds: pageArray})
                        setUpdated(true)
                    }}
                    style={{marginLeft: 0, width: '50%'}}
                />
                <TextField
                    id='excludePageIds'
                    label='Exclude Page Ids'
                    value={temp.excludePageIds}
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        const pageArray = e.target.value.split(',')
                        setTemp({...temp, excludePageIds: pageArray})
                        setUpdated(true)
                    }}
                    style={{marginLeft: 10, width: '49%'}}
                />
            </div>
            <div style={{display: 'flex', fontSize: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', width: 250}}>
                    <Checkbox checked={temp.targetAdminOnly} color='secondary'
                              onChange={() => {
                                  handleToggle('targetAdminOnly')
                              }}/>
                    <Link style={{color: '#fff'}} onClick={() => {
                        handleToggle('targetAdminOnly')
                    }}>Target Admin Only</Link>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Checkbox checked={temp.targetCollectionUsersOnly} color='secondary'
                              onChange={() => {
                                  handleToggle('targetCollectionUsersOnly')
                              }}/>
                    <Link style={{color: '#fff'}} onClick={() => {
                        handleToggle('targetCollectionUsersOnly')
                    }}>Target Collection Users Only</Link>
                </div>

            </div>
            <div style={{display: 'flex', fontSize: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', width: 250}}>
                    <Checkbox checked={temp.targetLoggedIn} color='secondary'
                              onChange={() => {
                                  handleToggle('targetLoggedIn')
                              }}/>
                    <Link style={{color: '#fff'}} onClick={() => {
                        handleToggle('targetLoggedIn')
                    }}>Target Logged In Only</Link>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Checkbox checked={temp.targetAnonymousNotOK} color='secondary'
                              onChange={() => {
                                  handleToggle('targetAnonymousNotOK')
                              }}/>
                    <Link style={{color: '#fff'}} onClick={() => {
                        handleToggle('targetAnonymousNotOK')
                    }}>Target Anonymous NOT ok</Link>
                </div>
            </div>
            <div style={{display: 'flex', fontSize: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', width: 250}}>
                    <Checkbox checked={temp.targetBlackBeltsOnly} color='secondary'
                              onChange={() => {
                                  handleToggle('targetBlackBeltsOnly')
                              }}/>
                    <Link style={{color: '#fff'}} onClick={() => {
                        handleToggle('targetBlackBeltsOnly')
                    }}>Target Black Belts Only</Link>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Checkbox checked={temp.noDismiss} color='secondary'
                              onChange={() => {
                                  handleToggle('noDismiss')
                              }}/>
                    <Link style={{color: '#fff'}} onClick={() => {
                        handleToggle('noDismiss')
                    }}>No Dismiss Button</Link>
                </div>
            </div>
            <div style={{display: 'flex', fontSize: '1rem'}}>
                <TextField
                    id='minVersion'
                    label='Minimum Version'
                    value={temp.minVersion || ''}
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        setTemp({...temp, minVersion: e.target.value})
                        setUpdated(true)
                    }}
                    style={{width:350, marginRight:20}}
                />
                <TextField
                    id='targetUserIds'
                    label='Target User Ids'
                    value={temp.targetUserIds || ''}
                    fullWidth
                    size='small'
                    margin='dense'
                    color='secondary'
                    onChange={e => {
                        const idArray = e.target.value.split(',')
                        setTemp({...temp, pageIds: idArray})
                        setUpdated(true)
                    }}
                />
            </div>
            <div style={{
                width: '100%',
                textAlign: 'right',
                padding: '0px 12px 8px 0px'
            }}>
                <span style={{fontSize: '0.9rem', marginRight: 100}}>ID: {temp?.id}</span>
                <Button style={{marginRight: 10, color: cancelColor}}
                        onClick={handleCancel}
                        disabled={!updated}
                >
                    Cancel
                </Button>
                <Button style={{marginRight: 0, color: saveEntryColor}}
                        onClick={handleSave}
                        disabled={!updated}
                >
                    Save
                </Button>
            </div>

        </div>

    )
}


