import React, {useCallback, useState} from 'react'
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
import formMap from './FormMappings'
import RafflePotForm from './RafflePotForm.jsx'
import isValidUrl from '../../util/isValidUrl'
import {FormHelperText} from '@mui/material'

function RaffleEntryForm() {

    const [formData, setFormData] = useState({})
    const [potData, setPotData] = useState({})
    const [potError, setPotError] = useState({})
    const [charityData, setCharityData] = useState({})

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

    const handlePotChange = useCallback((index, potDetails, complete) => {
        const newPotData = {...potData}
        newPotData[index] = potDetails
        setPotData(newPotData)
        setPotError(!complete)
    }, [potData])

    const handleSubmit = useCallback(() => {

        const base = 'https://docs.google.com/forms/d/e/1FAIpQLScNaJioyXOUkd-JSLuiH-RX18N-bQPodTrhwSgtjlQIaXaxBA/viewform?usp=pp_url'
        const params = Object.keys(formData).reduce((acc, key) => {
            const param = `&entry.${formMap[key]}=${encodeURIComponent(formData[key])}`
            acc = acc?.length > 0 ? `${acc}${param}` : param
            return acc
        }, '')

        const charityParam = `&entry.${formMap.charity}=${encodeURIComponent(charityData.itemTitle)}`

        console.log('handleSubmit potData', potData)

        const potParams = Object.keys(potData).reduce((acc, key) => {
            const paramId = formMap[`pot${potData[key].itemPotNumber}`]
            const param = `&entry.${paramId}=${potData[key].donation}`
            acc = acc?.length > 0 ? `${acc}${param}` : param
            return acc
        }, '')

        console.log('p', `${base}${charityParam}${params}${potParams}`)

        //openInNewTab(url + params)
    }, [charityData, formData, potData])

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
    const receiptURLHelperText = receiptUrlError ? 'Receipt link is not a valid URL' : ''
    const charityError = showIssues && !charityData.itemFullTitle

    const errors = (
        !formData['platform']
        || !formData['username']
        || !charityData.itemFullTitle
        || !formData['donation']
        || (!formData.receipt || receiptUrlError)
        || !!potError
    )

    const {flexStyle} = useWindowSize()
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const sectionStyle = {fontSize: '1.5rem', fontWeight: 700, marginBottom: 8}
    const questionStyle = {fontSize: '1.1rem', fontWeight: 400, marginBottom: 0}

    return (

        <div style={{paddingBottom: 32}}>
            <RaffleSubHead text={'ENTRY FORM - Testing Only'}/>

            <div style={{...style, padding: 20}}>
                <div style={sectionStyle}>About You</div>

                <div style={{display: flexStyle, margin: 12}}>
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
                        <FormHelperText>{isRequired('platform') ? 'Required Field' : ''}</FormHelperText>
                    </FormControl>

                    <FormControl style={{width: 250}} size='small'>
                        <TextField type='text' name='username' label='Username'
                                   value={formData.username ? formData.username : ''}
                                   error={isRequired('username')}
                                   helperText={isRequired('username') ? 'Required Field' : ''}
                                   onChange={handleChange} color='info' size='small'/>
                    </FormControl>
                </div>
            </div>


            <div style={{...style, padding: '0px 20px 20px 20px'}}>
                <div style={sectionStyle}>Your Donation</div>

                <div style={{display: flexStyle, margin: 12}}>
                    <div style={{flexGrow: 1, marginRight: 40}}>
                        <div style={questionStyle}>Selected Charity</div>
                        <div style={{height: 12}}/>
                        <RaffleAutocompleteBox allItems={mappedCharities}
                                               setItemDetails={setCharityData}
                                               getOptionTitle={charityFullTitle}
                                               searchText={'Search Charities'}
                                               error={charityError}/>
                        <div style={{display: showIssues && !charityData.itemFullTitle ? 'block' : 'none'}}
                             className='MuiFormHelperText-root Mui-error MuiFormHelperText-sizeSmall MuiFormHelperText-contained css-cxf8aw-MuiFormHelperText-root'>
                            Required Field
                        </div>
                    </div>
                    <div>
                        <div style={{...questionStyle}}>Total donation in USD</div>
                        <FormControl style={{margin: 8}}>
                            <TextField type='text' name='donation' label='Donation Amount'
                                       value={formData.donation ? formData.donation : ''}
                                       error={isRequired('donation')}
                                       helperText={isRequired('donation') ? 'Required Field' : ''}
                                       onChange={handleChange} color='info' size='small'/>
                        </FormControl>
                    </div>

                </div>
                <div style={{display: flexStyle, margin: 12, marginTop: 24}}>
                    <div style={questionStyle}>
                        Receipt from approved charity <span style={{fontWeight: 400}}>(hosted image link, must contain a visible date)</span>
                        <FormControl style={{margin: 8}} fullWidth>
                            <TextField type='text' name='receipt' label='Receipt Link'
                                       error={receiptUrlError} helperText={receiptURLHelperText}
                                       value={formData.receipt ? formData.receipt : ''}
                                       onChange={handleChange} color='info' size='small' fullWidth/>
                        </FormControl>
                    </div>
                </div>
            </div>

            <div style={{...style, padding: '0px 20px 20px 20px'}}>
                <div style={sectionStyle}>Your Pots</div>
                <RafflePotForm questionStyle={questionStyle} index={0} potData={potData}
                               handlePotChange={handlePotChange} showIssues={showIssues} setPotError={setPotError}/>
            </div>

            <div style={{...style, justifyContent: 'center', marginTop: 16, display: 'flex'}}>
                <Button variant='outlined' onClick={() => {
                    setShowIssues(!showIssues)
                }}
                        style={{
                            marginRight: 20,
                            color: showIssues ? '#de2323' : '#999',
                            borderColor: showIssues ? '#de2323' : '#999'
                        }}
                >Show Issues</Button>
                <Button color='success' variant='contained' onClick={handleSubmit}
                >CONTINUE</Button>
            </div>

            <div style={{...style, justifyContent: 'center', marginTop: 16, color: '#de2323', display: errors ? 'flex' : 'none'}}>
            (errors)
            </div>
        </div>

    )
}

export default RaffleEntryForm
