import React, {useCallback, useContext, useMemo, useRef, useState} from 'react'
import Button from '@mui/material/Button'
import RaffleSubHead from '../RaffleSubHead.jsx'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import useWindowSize from '../../util/useWindowSize.jsx'
import {FormHelperText} from '@mui/material'
import RafflePotConfigurator from './RafflePotConfigurator.jsx'
import RaffleDonationConfigurator from './RaffleDonationConfigurator.jsx'
import RaffleContext from '../RaffleContext.jsx'
import Dialog from '@mui/material/Dialog'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import validator from 'validator'
import DataContext from '../../context/DataContext.jsx'
import DBContext from '../../app/DBContext.jsx'
import FilterContext from '../../context/FilterContext.jsx'
import Box from '@mui/material/Box'
import RaffleFormDialogs from './RaffleFormDialogs.jsx'

function RaffleEntryForm({editEntryId = undefined, setEditEntryId}) {
    const {createRaffleEntry, updateRaffleEntry, testEntry} = useContext(DBContext)
    const {raffleAdmin} = useContext(RaffleContext)
    const {allEntries} = useContext(DataContext)
    const {setFilters} = useContext(FilterContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({})
    const [donationData, setDonationData] = useState([{amount: 0, receipt: ''}])
    const [potData, setPotData] = useState([{tickets: 0}])
    const [submitted, setSumbitted] = useState(false)

    const {displayStats, setDisplayStats} = useContext(RaffleContext)
    const [initial, setInitial] = useState(true)
    if (initial && displayStats) {
        setDisplayStats(false)
        setInitial(false)
    }

    const fillEntryData = useCallback((entry) => {
        console.log('auto-fill entry', entry)
        setFormData({
            platform: entry?.platform,
            username: entry?.username,
            belt: entry?.belt,
            notes: entry?.notes || ''
        })
        setDonationData(entry.donations || [{amount: 0, receipt: ''}])
        setPotData(entry.pots || [{tickets: 0}])
    }, [])

    const [editEntry, setEditEntry] = useState(null)
    if (raffleAdmin && editEntryId) {
        if (!editEntry || (editEntry && editEntry.id !== editEntryId)) {
            const entry = allEntries.find(e => e.id === editEntryId)
            if (entry) {
                setEditEntry(entry)
                fillEntryData(entry)
            }
        }
    }

    const handleCancelEdit = useCallback(() => {
        setEditEntryId(undefined)
        setEditEntry(null)
    }, [setEditEntryId])

    const allocated = useMemo(() => {
        return potData.reduce((acc, pot) => {
            const potTickets = parseInt(pot?.tickets) ? parseInt(pot?.tickets) : 0
            acc = acc ? acc + potTickets : potTickets
            return acc
        }, 0)
    }, [potData])

    const potError = useMemo(() => {
        return potData.reduce((_acc, pot) => {
            return !(pot?.itemTitle && pot?.tickets)
        }, false)
    }, [potData])

    const handleChange = useCallback(event => {
        const newFormData = {...formData}
        if (event.target.name === 'donation') {
            newFormData[event.target.name] = event.target.value.replace(/[^0-9]/, '')
        } else {
            newFormData[event.target.name] = event.target.value
        }
        setFormData(newFormData)
    }, [formData])

    // total up donations from multi-donation configurator
    const totalDonation = useMemo(() => {
        return (donationData || []).reduce((acc, d) => {
            const amt = parseInt(d?.amount)
            return acc + (isNaN(amt) ? 0 : amt)
        }, 0)
    }, [donationData])

    const buildRecord = useCallback(() => {
        const record = {
            ...formData,
            donations: donationData,
            pots: potData,
            totalDonation: totalDonation,
            allocatedTickets: allocated,
            status: editEntry?.status || 'pending'
        }
        if (import.meta.env.DEV) {
            record.dev = true
        }
        if (raffleAdmin) {
            record.adminEntry = true
        }
        return record
    }, [allocated, donationData, editEntry?.status, formData, potData, raffleAdmin, totalDonation])

    const logFormData = useCallback(() => {
        const record = buildRecord()
        console.log('record', record)
    }, [buildRecord])

    const handleSubmit = useCallback(async () => {
        const record = buildRecord()
        console.log('record', record)
        try {
            const id = await createRaffleEntry(record)
            console.log('raffle entry created:', id)
            setSumbitted(true)
        } catch (e) {
            console.error('Failed to create raffle entry', e)
        }
    }, [buildRecord, createRaffleEntry])

    const handleEditSave = useCallback(async (approve) => {
        const updatedEntry = {...editEntry, ...buildRecord()}
        if (approve) updatedEntry.status = 'approved'
        await updateRaffleEntry(updatedEntry)
        setFilters({id: updatedEntry.id})
        setEditEntryId(undefined)
        setEditEntry(null)
        setSumbitted(true)
    }, [buildRecord, editEntry, setEditEntryId, setFilters, updateRaffleEntry])

    const handleEntryComplete = useCallback(() => {
        navigate('/rafl')
    }, [navigate])

    const [showIssues, setShowIssues] = useState(false)

    const requiredFields = ['platform', 'username']
    const isRequired = (field => {
        return requiredFields.includes(field) && !formData[field] && showIssues
    })
    // Validate multi-donation entries
    const donationError = useMemo(() => {
        const list = donationData || []
        if (!list.length) return true
        let err = false
        list.forEach(d => {
            const urlOk = d?.receipt ? validator.isURL(d.receipt, {require_tld: false, require_protocol: true}) : false
            if (!(d?.charity?.itemFullTitle && d?.amount && urlOk)) {
                err = true
            }
        })
        if (totalDonation <= 0) err = true
        return err
    }, [donationData, totalDonation])

    const allocationError = totalDonation !== parseInt(allocated)

    const errors = (
        !formData['platform']
        || !formData['username']
        || donationError
        || !!potError
        || allocationError
    )
    const continueColor = (!errors) ? '#4dd04d' : '#666'

    const {isMobile, flexStyle} = useWindowSize()
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const sectionStyle = useMemo(() => ({fontSize: '1.5rem', fontWeight: 700, marginBottom: 8}), [])
    const questionStyle = useMemo(() => ({fontSize: '1.0rem', fontWeight: 400, marginBottom: 8}), [])
    const optionalHeaderStyle = {fontSize: '1.0rem', fontWeight: 400, marginBottom: 5, paddingLeft: 2, color: '#fff'}
    const contentsFontSize = isMobile ? '0.95rem' : '1.0rem'

    const containerRef = useRef(null)

    return (
        <React.Fragment>
            <Box style={{...style, paddingBottom: 32}}
                 ref={containerRef}
                 sx={{
                     position: 'relative',
                     overflow: 'hidden',
                     isolation: 'isolate'
                 }}>

                <RaffleFormDialogs/>

                <RaffleSubHead text={editEntryId ? 'EDIT RAFL ENTRY' : 'ENTRY FORM'}/>


                <div style={{
                    ...style,
                    backgroundColor: '#222',
                    minHeight: 72,
                    alignItems: 'center',
                    borderBottom: '1px #555 solid',
                    padding: '20px 20px'
                }}>


                    <div style={sectionStyle}>{editEntryId ? 'About' : 'About You'}</div>

                    <div style={{display: flexStyle, margin: '12px 12px 0px 12px'}}>
                        <FormControl style={{width: 250, marginRight: 16}} size='small' error={isRequired('platform')}>
                            <InputLabel color='info'>Preferred Platform</InputLabel>
                            <Select
                                label='Preferred Platform'
                                value={formData.platform || ''}
                                onChange={handleChange}
                                color='info'
                                name='platform'
                            >
                                <MenuItem value={'Discord'}>Discord</MenuItem>
                                <MenuItem value={'Reddit'}>Reddit</MenuItem>
                            </Select>
                            <FormHelperText>{isRequired('platform') ? 'Required Field' : ' '}</FormHelperText>
                        </FormControl>

                        <FormControl style={{width: 250, marginRight: 16}} size='small'>
                            <TextField type='text' name='username' label='Username'
                                       value={formData.username ? formData.username : ''}
                                       error={isRequired('username')}
                                       helperText={isRequired('username') ? 'Required Field' : ' '}
                                       onChange={handleChange} color='info' size='small'/>
                        </FormControl>

                        <FormControl style={{width: 180}} size='small'>
                            <InputLabel color='info'>Belt (optional)</InputLabel>
                            <Select
                                value={formData.belt ? formData.belt : ''}
                                label='Belt (optional)'
                                onChange={handleChange}
                                color='info'
                                name='belt'
                            >
                                <MenuItem value={'White'}>White</MenuItem>
                                <MenuItem value={'Yellow'}>Yellow</MenuItem>
                                <MenuItem value={'Orange'}>Orange</MenuItem>
                                <MenuItem value={'Green'}>Green</MenuItem>
                                <MenuItem value={'Blue'}>Blue</MenuItem>
                                <MenuItem value={'Purple'}>Purple</MenuItem>
                                <MenuItem value={'Brown'}>Brown</MenuItem>
                                <MenuItem value={'Red'}>Red</MenuItem>
                                <MenuItem value={'Black'}>Black</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>


                <div style={{
                    ...style,
                    backgroundColor: '#222',
                    minHeight: 72,
                    alignItems: 'center',
                    borderBottom: '1px #555 solid',
                    padding: '20px 20px'
                }}>
                    <div style={sectionStyle}>{editEntryId ? 'Donations' : 'Your Donations'}</div>

                    <RaffleDonationConfigurator donationData={donationData}
                                                setDonationData={setDonationData}
                                                showIssues={showIssues}
                                                questionStyle={questionStyle}
                    />

                    <div style={{display: 'flex', justifyContent: 'center', marginTop: 8}}>
                        <div style={{fontSize: '1.0rem'}}>Total donation:&nbsp;<strong>{totalDonation}</strong></div>
                    </div>
                </div>

                <div style={{
                    ...style,
                    backgroundColor: '#222',
                    minHeight: 72,
                    alignItems: 'center',
                    borderBottom: '1px #555 solid',
                    padding: '20px 20px'
                }}>
                    <div style={sectionStyle}>{editEntryId ? 'Pots' : 'Your Pots'}</div>

                    <RafflePotConfigurator donation={totalDonation} potData={potData}
                                           questionStyle={questionStyle}
                                           showIssues={showIssues} setPotData={setPotData}
                                           allocated={allocated}/>

                </div>

                {editEntry &&
                    <div style={{
                        ...style,
                        backgroundColor: '#222',
                        minHeight: 72,
                        alignItems: 'center',
                        borderBottom: '1px #555 solid',
                        padding: '20px 20px'
                    }}>
                        <div style={{marginTop: 0, display: 'flex'}}>
                            <div style={{...optionalHeaderStyle, flexGrow: 1, fontWeight: 700}}>
                                Entry Notes
                            </div>
                            <div style={{...optionalHeaderStyle, color: '#aaa', fontSize: '0.85rem'}}>
                                {formData?.notes?.length || 0}/1200
                            </div>
                        </div>
                        <TextField type='text' multiline fullWidth rows={2}
                                   name='notes'
                                   value={formData.notes || ''}
                                   onChange={handleChange}
                                   id='notes'
                                   color='info' style={{}}
                                   placeholder='Add additional notes about this entry'
                                   variant='outlined'
                                   InputProps={{style: {fontSize: contentsFontSize}}}
                                   slotProps={{
                                       htmlInput: {maxLength: 1200}
                                   }}
                        />
                    </div>
                }

                <div style={{
                    ...style,
                    backgroundColor: '#222',
                    minHeight: 72,
                    alignItems: 'center',
                    borderBottom: '1px #555 solid',
                    padding: '15px 20px 25px 20px'
                }}>
                    <div style={{...sectionStyle, textAlign: 'center'}}>All Done?</div>

                    <div style={{...style, justifyContent: 'center', marginTop: 0, display: 'flex'}}>
                        <div style={{display: errors ? 'flex' : 'none'}}>
                            <Button variant='outlined' onClick={() => {
                                setShowIssues(!showIssues)
                            }}
                                    style={{
                                        marginRight: 10,
                                        color: showIssues ? '#de2323' : '#bbb',
                                        borderColor: showIssues ? '#de2323' : '#bbb'
                                    }}
                            >Show Issues</Button>
                        </div>
                        {!editEntryId
                            ? <Button style={{backgroundColor: continueColor, color: '#000'}} variant='contained'
                                      disabled={errors} onClick={handleSubmit}
                            >Submit Entry</Button>
                            : <div style={{justifyContent: 'center', marginTop: 0, display: 'flex'}}>
                                <Button style={{backgroundColor: '#e0693c', color: '#000', marginRight: 10, lineHeight: '1.1rem'}}
                                        variant='contained'
                                        onClick={handleCancelEdit}
                                >Cancel</Button>
                                <Button style={{backgroundColor: continueColor, color: '#000', marginRight: 10, lineHeight: '1.1rem'}}
                                        variant='contained'
                                        disabled={errors} onClick={() => handleEditSave(false)}
                                >Save Edits</Button>
                                <Button style={{backgroundColor: continueColor, color: '#000', lineHeight: '1.1rem'}} variant='contained'
                                        disabled={errors} onClick={() => handleEditSave(true)}
                                >Save & Approve</Button>
                            </div>
                        }
                    </div>
                </div>

                <div style={{
                    ...style,
                    justifyContent: 'center',
                    marginTop: 16,
                    color: '#de2323',
                    textAlign: 'center'
                }}>
                    <Button style={{color: '#b00'}} variant='text' onClick={() => fillEntryData(testEntry)}
                    >fill test data</Button>
                    <Button style={{color: '#b00'}} variant='text' onClick={logFormData}
                    >log entry</Button>
                </div>

            </Box>

            <Dialog open={submitted} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.9}}
            }}>
                <div style={{width: 320, textAlign: 'center', padding: 30, fontSize: '1.1rem'}}>
                    <span style={{fontSize: '1.3rem', fontWeight: 700}}>Thanks for entering!</span><br/><br/>
                    Your entry will be reviewed shortly.
                    We&#39;ll reach out to you via your chosen platform to let you know your entry has been approved or
                    to resolve any issues.
                    <br/><br/>
                    You can always make another donation and submit again...<br/>
                    <Link onClick={() => handleEntryComplete}
                          style={{
                              color: '#fff',
                              textDecorationColor: '#888',
                              cursor: 'pointer',
                              fontWeight: 700,
                              lineHeight: '2.5rem'
                          }}>
                        Take another look at the pots!
                    </Link><br/><br/>

                    <Button variant='contained' style={{backgroundColor: '#333'}}
                            onClick={handleEntryComplete}>Close</Button>

                </div>
                {raffleAdmin &&
                    <Link onClick={() => setSumbitted(false)}>(close)</Link>
                }
            </Dialog>

        </React.Fragment>
    )
}

export default RaffleEntryForm
