import React, {useCallback, useContext, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import RaffleAutocompleteBox from './RaffleAutocompleteBox.jsx'
import allCharities from '../../data/raflCharities.json'
import RaffleSubHead from '../RaffleSubHead.jsx'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import useWindowSize from '../../util/useWindowSize.jsx'
import {FormHelperText} from '@mui/material'
import RafflePotConfigurator from './RafflePotConfigurator.jsx'
import RaffleContext from '../RaffleContext.jsx'
import Dialog from '@mui/material/Dialog'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import validator from 'validator'

function RaffleEntryForm() {
    const navigate = useNavigate()
    const {raffleAdminRole} = useContext(RaffleContext)
    const [submitted, setSumbitted] = useState(false)
    const [formData, setFormData] = useState({})
    const [charityData, setCharityData] = useState({})
    const [potData, setPotData] = useState({0: {tickets: 0}})
    const potKeys = Array.from(Object.keys(potData))

    const {VITE_RAFL_VIEW_FORM_ID: raflFormId} = import.meta.env
    const {raflQuestionMap, displayStats, setDisplayStats} = useContext(RaffleContext)
    const [initial, setInitial] = useState(true)
    if (initial && displayStats) {
        setDisplayStats(false)
        setInitial(false)
    }

    const allocated = useMemo(() => {
        return potKeys.reduce((acc, pot) => {
            const potTickets = parseInt(potData[pot].tickets) ? parseInt(potData[pot].tickets) : 0
            acc = acc ? acc + potTickets : potTickets
            return acc
        }, 0)
    }, [potData, potKeys])

    const potError = useMemo(() => {
        return potKeys.reduce((_acc, pot) => {
            return !(potData[pot].itemTitle && potData[pot].tickets)
        }, false)
    }, [potData, potKeys])

    const openInNewTab = useCallback((url) => { //eslint-disable-line
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    const handleChange = useCallback(event => {
        const newFormData = {...formData}

        if (event.target.name === 'donation') {
            newFormData[event.target.name] = event.target.value.replace(/[^0-9]/, '')
        } else {
            newFormData[event.target.name] = event.target.value
        }
        setFormData(newFormData)
    }, [formData])

    const handlePotChange = useCallback((index, potDetails) => {
        const newPotData = {...potData}
        newPotData[index] = potDetails
        setPotData(newPotData)
    }, [potData])


    const handleSubmit = useCallback(() => {

        const base = `https://docs.google.com/forms/d/e/${raflFormId}/viewform?usp=pp_url`

        const platform = `&entry.${raflQuestionMap[0].formId}=${encodeURIComponent(formData.platform)}`
        const username = `&entry.${raflQuestionMap[1].formId}=${encodeURIComponent(formData.username)}`
        const charity = `&entry.${raflQuestionMap[2].formId}=${encodeURIComponent(charityData.itemTitle)}`
        const receipt = `&entry.${raflQuestionMap[3].formId}=${encodeURIComponent(formData.receipt)}`
        const donation = `&entry.${raflQuestionMap[4].formId}=${encodeURIComponent(formData.donation)}`
        const belt = `&entry.${raflQuestionMap[75].formId}=${encodeURIComponent(formData.belt)}`
        const parameters = [platform, username, charity, receipt, donation, belt]

        const potParams = Object.keys(potData).reduce((acc, key) => {
            const formQuestion = raflQuestionMap.find(q => q.text === potData[key].itemFullTitle)
            const paramId = formQuestion?.formId || 'undefined'
            const param = `&entry.${paramId}=${potData[key].tickets}`
            acc = acc?.length > 0 ? `${acc}${param}` : param
            return acc
        }, '')

        console.log('url', `${parameters.join('')}${potParams}`)
        setSumbitted(true)
        openInNewTab(`${base}${parameters.join('')}${potParams}`)

    }, [charityData, formData, openInNewTab, potData, raflFormId, raflQuestionMap])

    const mappedCharities = allCharities
        .sort((a, b) => {
            return a.name.localeCompare(b.name)
        })
        .map(c => {
        return {...c, title: c.name}
    })
    const charityFullTitle = useCallback((charity) => {
        return charity.name
    }, [])

    const [showIssues, setShowIssues] = useState(false)

    const requiredFields = ['platform', 'username', 'charity', 'donation']
    const isRequired = (field => {
        return requiredFields.includes(field) && !formData[field] && showIssues
    })
    const receiptUrlError = (formData.receipt || showIssues) && !validator.isURL(formData.receipt)
    const receiptURLHelperText = receiptUrlError ? 'Receipt link is not a valid URL' : ' '
    const charityError = showIssues && !charityData.itemFullTitle
    const allocationError = parseInt(formData.donation) !== parseInt(allocated)

    const errors = (
        !formData['platform']
        || !formData['username']
        || !charityData.itemFullTitle
        || !formData['donation']
        || (!formData.receipt || receiptUrlError)
        || !!potError
        || allocationError
    )
    const continueColor = !errors ? '#4dd04d' : '#666'

    const {flexStyle} = useWindowSize()
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const sectionStyle = {fontSize: '1.5rem', fontWeight: 700, marginBottom: 8}
    const questionStyle = {fontSize: '1.1rem', fontWeight: 400, marginBottom: 8}

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
                    <div style={sectionStyle}>Your Donation</div>

                    <div style={{display: flexStyle, margin: '12px 12px 0px 12px'}}>
                        <div style={{flexGrow: 1, marginRight: 40, height: 100}}>
                            <div style={questionStyle}>Selected Charity</div>
                            <div style={{height: 6}}/>
                            <RaffleAutocompleteBox allItems={mappedCharities}
                                                   setItemDetails={setCharityData}
                                                   getOptionTitle={charityFullTitle}
                                                   searchText={'Search Charities'}
                                                   error={charityError}/>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#f44336',
                                margin: '4px 14px 0px 14px',
                                display: showIssues && !charityData.itemFullTitle ? 'block' : 'none'
                            }}>
                                Required Field
                            </div>
                        </div>
                        <div>
                            <div style={{...questionStyle}}>Total donation in USD</div>
                            <FormControl>
                                <TextField type='text' name='donation' label='Donation Amount'
                                           value={formData.donation ? formData.donation : ''}
                                           error={isRequired('donation')}
                                           helperText={isRequired('donation') ? 'Required Field' : ' '}
                                           onChange={handleChange} color='info' size='small'/>
                            </FormControl>
                        </div>
                    </div>

                    <div style={{margin: '6px 12px 0px 12px'}}>
                        <div style={questionStyle}>
                            Receipt from approved charity <span style={{fontWeight: 400}}>(hosted image link, must contain a visible date)</span>
                        </div>

                        <FormControl fullWidth>
                            <TextField type='text' name='receipt' label='Receipt Link'
                                       error={receiptUrlError} helperText={receiptURLHelperText}
                                       value={formData.receipt ? formData.receipt : ''}
                                       onChange={handleChange} color='info' size='small' fullWidth/>
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
                    <div style={sectionStyle}>Your Pots</div>

                    <RafflePotConfigurator donation={formData.donation} potData={potData}
                                           handlePotChange={handlePotChange} questionStyle={questionStyle}
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
                        >Review Entry on Google</Button>
                    </div>
                    {raffleAdminRole &&
                        <div style={{
                            ...style,
                            justifyContent: 'center',
                            marginTop: 16,
                            color: '#de2323',
                            display: errors ? 'flex' : 'none'
                        }}>
                            <Button style={{color: '#b00'}} variant='text' onClick={handleSubmit}
                            >Test Send Incomplete</Button>
                        </div>
                    }
                </div>
            </div>

            <Dialog open={submitted} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.9}}
            }}>
                <div style={{width: 320, textAlign: 'center', padding: 30, fontSize: '1.1rem'}}>
                    <span style={{fontSize: '1.3rem', fontWeight: 700}}>Thanks for entering!</span><br/><br/>
                    <span style={{fontSize: '1.2rem', lineHeight: '1.2rem'}}>
                        Make sure you hit <strong>SUBMIT</strong> on the google review form
                        or your entry will not be counted.
                        <br/><br/></span>

                    You can always make another donation and submit
                    again... <Link onClick={() => navigate('/rafl')}
                                   style={{color: '#ddd', textDecorationColor: '#888', cursor: 'pointer'}}>
                    Take another look at the pots!
                </Link><br/><br/>

                    <Link onClick={() => setSumbitted(false)}>(close)</Link>
                </div>
            </Dialog>
        </React.Fragment>
    )
}

export default RaffleEntryForm
