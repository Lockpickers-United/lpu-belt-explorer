import React, {useState, useCallback, useContext} from 'react'
import {useParams} from 'react-router-dom'
import BeltStripe from '../entries/BeltStripe.jsx'
import FieldValue from '../entries/FieldValue.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import DBContext from '../app/DBContext.jsx'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import {enqueueSnackbar} from 'notistack'
import dayjs from 'dayjs'

function BlackBeltAwardRow({owner, date}) {
    const {userId} = useParams()
    const {updateProfileBlackBeltAwardedAt} = useContext(DBContext)
    const [expanded, setExpanded] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [evidenceDate, setEvidenceDate] = useState(dayjs.utc(date))

    const dateText = dayjs.utc(date).format('L')

    const handleChange = useCallback((_, isExpanded) => {
        if (owner) {
            setExpanded(isExpanded)
        }
    }, [owner])

    const cancelEdit = useCallback(() => {
        setEvidenceDate(dayjs.utc(date))
        setUpdated(false)
    }, [date])

    const handleSave = useCallback(async () => {
        try {
            updateProfileBlackBeltAwardedAt(userId, evidenceDate)
            enqueueSnackbar('Profile updated')
            setUpdated(false)
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile')
        }
    }, [userId, evidenceDate, updateProfileBlackBeltAwardedAt])

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', display: 'flex', placeItems: 'center'}
    const cursorStyle = !owner ? {cursor: 'default'} : {}
    const expandIcon = owner ? <ExpandMoreIcon/> : null

    const {isMobile} = useWindowSize()
    const flexType = !isMobile ? 'flex' : 'block'
    const nameDivWidth = !isMobile ? '58%' : '70%'
    const infoDivStyle = !isMobile ? {display: 'flex', margin: '0px 0px 0px 20px'} : {
        display: 'block',
        marginLeft: 0,
        placeItems: 'center'
    }
    const saveEntryColor = updated ? '#fff' : '#555'
    const cancelColor = updated ? '#e15c07' : '#555'

    return (
        <React.Fragment>
            <Accordion expanded={expanded} onChange={handleChange}>
                <AccordionSummary expandIcon={expandIcon} style={{...style, ...cursorStyle}}>
                    <BeltStripe value='Black'/>
                    <div style={{
                        margin: '12px 0px 0px 8px',
                        width: nameDivWidth,
                        flexShrink: 0,
                        flexDirection: 'column'
                    }}>
                        <FieldValue
                            value='Black Belt Awarded'
                            textStyle={{marginLeft: '0px', fontWeight: 700}}
                            style={{marginBottom: '2px'}}
                        />
                    </div>

                    <div style={{display: flexType, placeItems: 'center', marginLeft: 10}}>
                        <div style={{display: 'flex', width: 76}}/>
                        <div style={infoDivStyle}>
                            <div
                                style={{margin: '0px 0px 0px 0px'}}>
                                {dateText}
                            </div>
                        </div>
                    </div>
                </AccordionSummary>
                {expanded &&
                    <AccordionDetails sx={{padding: '4px 16px 0px 26px'}}>
                        <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>
                            <React.Fragment>
                                <div style={{display: 'flex', width: '100%', marginBottom: 20}}>
                                    <DatePicker
                                        label='Pick date'
                                        value={evidenceDate}
                                        onChange={(newValue) => {
                                            setEvidenceDate(newValue)
                                            setUpdated(true)
                                        }}
                                        sx={{width: 400}}
                                        disableFuture
                                    />
                                    <div style={{
                                        width: '100%',
                                        textAlign: 'right',
                                        position: 'relative',
                                        top: '30px',
                                        padding: '0px 12px 8px 0px'
                                    }}>
                                        <Button style={{marginRight: 10, color: cancelColor}}
                                                onClick={cancelEdit}
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
                            </React.Fragment>
                        </LocalizationProvider>
                    </AccordionDetails>
                }
            </Accordion>
            <Divider/>
        </React.Fragment>
    )
}

export default BlackBeltAwardRow
