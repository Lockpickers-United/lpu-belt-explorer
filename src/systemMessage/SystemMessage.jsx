import React, {useCallback, useContext, useMemo} from 'react'
import Button from '@mui/material/Button'
import {useLocation, useNavigate} from 'react-router-dom'
import SystemMessageContext from './SystemMessageContext.jsx'

import MoodIcon from '@mui/icons-material/Mood'
import InfoIcon from '@mui/icons-material/Info'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import DBContext from '../app/DBContext.jsx'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

function SystemMessage() {
    const {lockCollection, addToLockCollection} = useContext(DBContext)
    const {getMessage} = useContext(SystemMessageContext)

    const location = useLocation()
    const message = useMemo(() => getMessage(location.pathname), [getMessage, location])

    const navigate = useNavigate()
    const handleClick = useCallback(() => {
        navigate(message['linkDestination'])
    }, [message, navigate])

    const handleDismiss = useCallback(async () => {
        await addToLockCollection('dismissedMessages', message?.id)
    }, [addToLockCollection, message])

    const messageHeader = message?.messageHeadline
    const messageText = message?.messageText

    const messageColors = {'Good News': '#75ae55', 'Neutral': '#999', 'Info': '#609cce', 'Alert': '#d03f3f'}
    const messageIcons = {
        'Good News': <MoodIcon fontSize='medium'/>,
        'Neutral': <InfoOutlinedIcon fontSize='medium'/>,
        'Info': <InfoIcon fontSize='medium'/>,
        'Alert': <ReportProblemIcon fontSize='small'/>
    }

    const messageColor = messageColors[message?.messageType]
    const messageIcon = messageIcons[message?.messageType]

    const messageTypeStyle = {
        width: 30,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        paddingTop: 15,
        backgroundColor: messageColor,
        display: 'flex',
        justifyContent: 'center'
    }

    if (!message) return null

    return (
        <div style={{
            minWidth: '320px', maxWidth: 680, height: '100%',
            margin: '25px auto 25px auto',
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '1rem',
                lineHeight: '1.2rem',
                width: '100%',
                textAlign: 'left',
                marginTop: 15,
                border: `1px solid ${messageColor}`,
                display: 'flex',
                alignItems: 'center', position: 'relative'
            }}>
                <div style={messageTypeStyle}>{messageIcon}</div>
                <div style={{width: '100%'}}>
                    <div style={{height: '100%', width: '100%', padding: '10px 20px 5px 50px'}}>
                        <b>{messageHeader}</b> {messageText}
                    </div>
                    <div style={{width: '100%', textAlign: 'right', padding: '3px 20px 8px 0px'}}>
                        {message.linkText &&
                            <Button variant='text' size='small'
                                    style={{
                                        lineHeight: '.9rem',
                                        textAlign: 'left',
                                        marginRight: 10,
                                        color: messageColor
                                    }}
                                    onClick={handleClick}
                            >{message.linkText}</Button>
                        }
                        {!message.noDismiss && Object.keys(lockCollection).length > 0 &&
                            <Button variant='text' size='small'
                                    style={{
                                        lineHeight: '.9rem',
                                        textAlign: 'left',
                                        color: '#999'
                                    }}
                                    onClick={handleDismiss}
                            >Dismiss</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemMessage
