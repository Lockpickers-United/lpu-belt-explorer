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
import formMap from './FormMap'
import isValidUrl from '../../util/isValidUrl'
import {FormHelperText} from '@mui/material'
import RafflePotConfigurator from './RafflePotConfigurator.jsx'
import RaffleContext from '../RaffleContext.jsx'

function RaffleEntryForm() {
    const [formData, setFormData] = useState({})
    const [charityData, setCharityData] = useState({})
    const [potData, setPotData] = useState({0: {tickets:0}})
    const potKeys = Array.from(Object.keys(potData))

    const {displayStats, setDisplayStats} = useContext(RaffleContext)
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
        return potKeys.reduce((acc, pot) => {
            return !(potData[pot].tickets && potData[pot].tickets)
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

        const base = 'https://docs.google.com/forms/d/e/1FAIpQLScNaJioyXOUkd-JSLuiH-RX18N-bQPodTrhwSgtjlQIaXaxBA/viewform?usp=pp_url'
        const params = Object.keys(formData).reduce((acc, key) => {
            const param = `&entry.${formMap[key]}=${encodeURIComponent(formData[key])}`
            acc = acc?.length > 0 ? `${acc}${param}` : param
            return acc
        }, '')
        const charityParam = `&entry.${formMap.charity}=${encodeURIComponent(charityData.itemTitle)}`
        const potParams = Object.keys(potData).reduce((acc, key) => {
            const paramId = potData[key].itemFormId
            const param = `&entry.${paramId}=${potData[key].tickets}`
            acc = acc?.length > 0 ? `${acc}${param}` : param
            return acc
        }, '')

        openInNewTab(`${base}${charityParam}${params}${potParams}`)

    }, [charityData.itemTitle, formData, openInNewTab, potData])

    const mappedCharities = allCharities.map(c => {
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
    const receiptUrlError = (formData.receipt || showIssues) && !isValidUrl(formData.receipt)
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

                    <FormControl style={{width: 250}} size='small'>
                        <TextField type='text' name='username' label='Username'
                                   value={formData.username ? formData.username : ''}
                                   error={isRequired('username')}
                                   helperText={isRequired('username') ? 'Required Field' : ' '}
                                   onChange={handleChange} color='info' size='small'/>
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
                        <div style={{fontSize:'0.75rem', color:'#f44336', margin:'4px 14px 0px 14px', display: showIssues && !charityData.itemFullTitle ? 'block' : 'none'}}>
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
                                       allocated={allocated} />

            </div>


            <div style={{...style, padding: '20px 20px 20px 20px'}}>
                <div style={{...sectionStyle, textAlign:'center'}}>All Done?</div>

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
                    <Button style={{backgroundColor:continueColor, color:'#000'}} variant='contained'
                            disabled={errors} onClick={handleSubmit}
                    >Review Entry on Google</Button>
                </div>

                <div style={{
                    ...style,
                    justifyContent: 'center',
                    marginTop: 16,
                    color: '#de2323',
                    display: errors ? 'flex' : 'none'
                }}>
                    <Button style={{color:'#b00'}} variant='text' onClick={handleSubmit}
                    >Test Send Incomplete</Button>
                </div>
            </div>
        </div>
    )
}

export default RaffleEntryForm
