import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Stack from '@mui/material/Stack'
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import FieldValue from '../../entries/FieldValue'
import SystemMessage from '../../systemMessage/SystemMessage.jsx'
import SystemMessageForm from './SystemMessageForm.jsx'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import DBContext from '../../app/DBContext.jsx'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function SystemMessageRow({message, expanded, onExpand, setControlsExpanded}) {
    const {id, dbId, description, pageIds} = message
    const {updateSystemMessageStatus} = useContext(DBContext)
    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)
    const [temp, setTemp] = useState({...message})
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        if (expanded && ref && !scrolled) {
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
    }, [expanded, message, scrolled])

    const handleChange = useCallback((_, isExpanded) => {
        onExpand && onExpand(isExpanded ? message.id : false)
    }, [message.id, onExpand])

    const handleUpdate = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        const dt = dayjs().utc().format()
        setTemp({...temp, status: e.target.value, modified: dt})
        updateSystemMessageStatus(dbId, e.target.value, dt)
    }, [dbId, temp, updateSystemMessageStatus])

    const style = {width: 760, marginLeft: 'auto', marginRight: 'auto'}
    const rowOpactity = temp.status === 'archived'
        ? 0.4
        : (temp.status === 'completed' || temp.status === 'pending')
            ? 0.8
            : 1

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <div style={{display: 'block', width: 680, opacity: rowOpactity}} key={temp.id}>
                    <div style={{margin: '2px 0px 2px 4px', width: '100%', display: 'flex', placeItems: 'center'}}>
                        <div style={{
                            fontWeight: 500,
                            fontSize: '1.2rem',
                            lineHeight: 1.25,
                            marginBottom: '4px',
                            flexGrow: 1
                        }}>
                            {description} <span style={{fontWeight: 400, color: '#bbb', fontSize: '1rem'}}>({id})</span><br/>
                            <span style={{fontWeight: 400, color: '#bbb', fontSize: '0.93rem'}}>{pageIds?.join(', ')}</span>
                        </div>
                        <div style={{fontWeight: 400, color: '#bbb', fontSize: '1rem'}}>
                            <FieldValue
                                name='Priority'
                                value={temp.priority}
                                headerStyle={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.73rem'}}
                                textStyle={{color: '#fff', marginTop: '10px', fontWeight: 700}}
                                style={{height: 40, margin: '8px 0px 4px 0px'}}
                            />
                        </div>

                        <TextField
                            select
                            variant='standard'
                            style={{width: 150, fontWeight: 700, marginLeft: 30}}
                            sx={{
                                '.MuiInputBase-root': {
                                    fontWeight: 700, paddingLeft: '5px'
                                }
                            }}
                            id='status'
                            label='Status'
                            value={temp.status}
                            size='small'
                            margin='dense'
                            color='secondary'
                            onChange={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleUpdate(e)
                            }}
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                        >
                            <MenuItem value='active'>Active</MenuItem>
                            <MenuItem value='pending'>Pending</MenuItem>
                            <MenuItem value='completed'>Completed</MenuItem>
                            <MenuItem value='archived'>Archived</MenuItem>
                        </TextField>

                    </div>
                    {temp.status !== 'archived' &&
                        <SystemMessage override={temp}/>
                    }
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '8px 16px 0px 16px'}}>
                        <div style={{display: 'block'}}>

                            {temp.status === 'archived' &&
                                <SystemMessage override={temp}/>
                            }
                            <Stack direction='row' alignItems='flex-start' style={{flexGrow: 1}}>

                                <SystemMessageForm message={message} temp={temp} setTemp={setTemp} updated={updated}
                                                   setUpdated={setUpdated} setControlsExpanded={setControlsExpanded}/>

                            </Stack>

                        </div>
                    </AccordionDetails>
                    <AccordionActions disableSpacing>
                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}


export default React.memo(SystemMessageRow, (prevProps, nextProps) => {
    const prevEntryKeys = Object.keys(prevProps.message)
    const nextEntryKeys = Object.keys(nextProps.message)

    if (prevEntryKeys.length !== nextEntryKeys.length) {
        return false
    }
    for (let idx = 0; idx < prevEntryKeys.length; idx++) {
        if (prevEntryKeys[idx] !== nextEntryKeys[idx] || prevProps.message[prevEntryKeys[idx]] !== nextProps.message[nextEntryKeys[idx]]) {
            return false
        }
    }
    return prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand
})
