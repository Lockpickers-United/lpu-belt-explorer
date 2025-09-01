import React, {useCallback, useContext, useMemo, useState} from 'react'
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
import DBContextRaffle from '../DBContextRaffle.jsx'
import Dialog from '@mui/material/Dialog'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import validator from 'validator'

function RaffleEntryForm() {
    const dbRaffle = useContext(DBContextRaffle)
    const {testEntry} = useContext(DBContextRaffle)
    const navigate = useNavigate()
    const {raffleAdmin} = useContext(RaffleContext)
    const [submitted, setSumbitted] = useState(false)

    const [formData, setFormData] = useState({})
    const [donationData, setDonationData] = useState([{amount: 0, receipt: ''}])
    const [potData, setPotData] = useState([{tickets: 0}])

    const {displayStats, setDisplayStats} = useContext(RaffleContext)
    const [initial, setInitial] = useState(true)
    if (initial && displayStats) {
        setDisplayStats(false)
        setInitial(false)
    }

    const allocated = useMemo(() => {
        return potData.reduce((acc, pot) => {
            const potTickets = parseInt(pot?.tickets) ? parseInt(pot?.tickets) : 0
            acc = acc ? acc + potTickets : potTickets
            return acc
        }, 0)
    }, [potData])

    const potError = useMemo(() => {
        return potData.reduce((acc, pot) => {
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

    const fillTestData = useCallback(() => {
        console.log('testEntry', testEntry)
        setFormData({
            platform: testEntry?.platform,
            username: testEntry?.username,
            belt: testEntry?.belt,
        })
        setDonationData(testEntry.donations || [{amount: 0, receipt: ''}])
        setPotData(testEntry.pots || [{tickets: 0}])
    },[testEntry])

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
            status: 'pending',
        }
        if (import.meta.env.DEV) {
            record.dev = true
        }
        if (raffleAdmin) {
            record.adminEntry = true
        }
        return record
    }, [allocated, donationData, formData, potData, raffleAdmin, totalDonation])

    const logFormData = useCallback(() => {
        const record = buildRecord()
        console.log('record', record)
    }, [buildRecord])

    const handleSubmit = useCallback(async () => {
        const record = buildRecord()
        console.log('record', record)

        try {
            const id = await dbRaffle?.createRaffleEntry?.(record)
            console.log('raffle entry created:', id)
            setSumbitted(true)
        } catch (e) {
            console.error('Failed to create raffle entry', e)
        }
    }, [buildRecord, dbRaffle])

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

    const allocationError = parseInt(totalDonation) !== parseInt(allocated)

    const errors = (
        !formData['platform']
        || !formData['username']
        || donationError
        || !!potError
        || allocationError
    )
    const continueColor = !errors ? '#4dd04d' : '#666'

    const {flexStyle} = useWindowSize()
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const sectionStyle = useMemo(() => ({fontSize: '1.5rem', fontWeight: 700, marginBottom: 8}), [])
    const questionStyle = useMemo(() => ({fontSize: '1.1rem', fontWeight: 400, marginBottom: 8}), [])

    return (
        <React.Fragment>
            <div style={{paddingBottom: 32}}>
                <RaffleSubHead text={'ENTRY FORM'}/>

                <div style={{
                    ...style,
                    backgroundColor: '#222',
                    minHeight: 72,
                    alignItems: 'center',
                    borderBottom: '1px #555 solid',
                    padding: '20px 20px'
                }}>

                    <div style={sectionStyle}>About You</div>

                    <div style={{display: flexStyle, margin: '12px 12px 0px 12px'}}>
                        <FormControl style={{width: 250, marginRight: 16}} size='small' error={isRequired('platform')}>
                            <InputLabel color='info'>Preferred Platform</InputLabel>
                            <Select
                                value={formData.platform ? formData.platform : ''}
                                label='Preferred Platform'
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
                    <div style={sectionStyle}>Your Donation(s)</div>

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
                    <div style={sectionStyle}>Your Pots</div>

                    <RafflePotConfigurator donation={totalDonation} potData={potData}
                                           questionStyle={questionStyle}
                                           showIssues={showIssues} setPotData={setPotData}
                                           allocated={allocated}/>

                </div>


                <div style={{...style, padding: '20px 20px 20px 20px'}}>
                    <div style={{...sectionStyle, textAlign: 'center'}}>All Done?</div>

                    <div style={{...style, justifyContent: 'center', marginTop: 0, display: 'flex'}}>
                        <div style={{display: errors ? 'flex' : 'none'}}>
                            <Button variant='outlined' onClick={() => {
                                setShowIssues(!showIssues)
                            }}
                                    style={{
                                        marginRight: 20,
                                        color: showIssues ? '#de2323' : '#bbb',
                                        borderColor: showIssues ? '#de2323' : '#bbb'
                                    }}
                            >Show Issues</Button>
                        </div>
                        <Button style={{backgroundColor: continueColor, color: '#000'}} variant='contained'
                                disabled={errors} onClick={handleSubmit}
                        >Submit Entry</Button>
                    </div>
                    <div style={{
                        ...style,
                        justifyContent: 'center',
                        marginTop: 16,
                        color: '#de2323',
                        textAlign: 'center'
                    }}>
                        <Button style={{color: '#b00'}} variant='text' onClick={fillTestData}
                        >fill test data</Button>
                        <Button style={{color: '#b00'}} variant='text' onClick={logFormData}
                        >log entry</Button>
                    </div>
                </div>
            </div>

            <Dialog open={submitted} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.9}}
            }}>
                <div style={{width: 320, textAlign: 'center', padding: 30, fontSize: '1.1rem'}}>
                    <span style={{fontSize: '1.3rem', fontWeight: 700}}>Thanks for entering!</span><br/><br/>
                    <span style={{fontSize: '1.1rem', lineHeight: '0.8rem'}}>
                        Your entry will be reviewed shortly.
                        We&#39;ll reach out to you via your chosen platform to let you know your entry has been approved or to resolve any issues.
                        <br/><br/></span>

                    You can always make another donation and submit
                    again... <Link onClick={() => navigate('/rafl')}
                                   style={{color: '#ddd', textDecorationColor: '#888', cursor: 'pointer'}}>
                    Take another look at the pots!
                </Link><br/><br/>

                    {raffleAdmin &&
                        <Link onClick={() => setSumbitted(false)}>(close)</Link>
                    }
                </div>
            </Dialog>
        </React.Fragment>
    )
}

export default RaffleEntryForm
