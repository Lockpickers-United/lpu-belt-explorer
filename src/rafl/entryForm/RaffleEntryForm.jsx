import React, {useCallback, useState} from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
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

function RaffleEntryForm() {

    const [formData, setFormData] = useState({})
    const [potData, setPotData] = useState({})
    const [charityData, setCharityData] = useState({})
    
    const handleChange = useCallback(event => {
        const newFormData = {...formData}
        newFormData[event.target.name] = event.target.value
        setFormData(newFormData)
    }, [formData])

    const handlePotChange  = useCallback((index, potDetails) => {
        const newPotData = {...potData}
        newPotData[index] = potDetails
        setPotData(newPotData)
    }, [potData])

    const openInNewTab = useCallback((url) => { //eslint-disable-line
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

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
        },'')

        console.log('p', `${base}${charityParam}${params}${potParams}`)

        //openInNewTab(url + params)
    }, [charityData, formData, potData])

    const mappedCharities = allCharities.map(c => {
        return {...c, title: c.name}
    })

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const charityFullTitle = useCallback((charity) => {
        return charity.name
    }, [])

    const {flexStyle} = useWindowSize()

    const sectionStyle = {fontSize: '1.5rem', fontWeight: 700, marginBottom: 8}
    const questionStyle = {fontSize: '1.1rem', fontWeight: 400, marginBottom: 0}

    return (

        <div style={{paddingBottom: 32}}>
            <RaffleSubHead text={'ENTRY FORM - Testing Only'}/>

            <div style={{...style, padding: 20}}>
                <div style={sectionStyle}>About You</div>

                <div style={{display: flexStyle, margin: 12}}>
                    <FormControl style={{width: 250, marginRight: 16}} size='small'>
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
                    </FormControl>

                    <FormControl style={{width: 250}} size='small'>
                        <TextField type='text' name='username' label='Username'
                                   value={formData.username ? formData.username : ''}
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
                                               searchText={'Search Charities'}/>
                    </div>
                    <div>
                        <div style={{...questionStyle}}>Total donation in USD</div>
                        <FormControl style={{margin: 8}}>
                            <TextField type='text' name='donation' label='Donation Amount'
                                       value={formData.donation ? formData.donation : ''}
                                       onChange={handleChange} color='info' size='small'/>
                        </FormControl>
                    </div>
                </div>
                <div style={{display: flexStyle, margin: 12, marginTop: 24}}>
                    <div style={questionStyle}>
                        Receipt from approved charity <span style={{fontWeight: 400}}>(hosted image link, must contain a visible date)</span>
                        <FormControl style={{margin: 8}} fullWidth>
                            <TextField type='text' name='receipt' label='Receipt Link'
                                       value={formData.receipt ? formData.receipt : ''}
                                       onChange={handleChange} color='info' size='small' fullWidth/>
                        </FormControl>
                    </div>
                </div>
            </div>

            <div style={{...style, padding: '0px 20px 20px 20px'}}>
                <div style={sectionStyle}>Your Pots</div>
                <RafflePotForm questionStyle={questionStyle} index={0} potData={potData} handlePotChange={handlePotChange}/>
            </div>

            <Box style={{...style, textAlign: 'center', marginTop: 16}}>
                <Button color='success' size='small' variant='contained' onClick={handleSubmit}
                >CONTINUE</Button>
            </Box>


        </div>

    )
}

export default RaffleEntryForm
