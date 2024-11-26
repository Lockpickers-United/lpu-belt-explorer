import React, {useCallback, useState} from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import RaffleAutocompleteBox from './RaffleAutocompleteBox.jsx'
import allPots from '../../data/rafl.json'
import allCharities from '../../data/raflCharities.json'
import RaffleSubHead from '../RaffleSubHead.jsx'

function RaffleEntryForm() {

    const [potDetails, setPotDetails] = useState({})
    const [charityDetails, setCharityDetails] = useState({})

    const formComplete = (!!potDetails?.itemId)
    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    const handleSubmit = useCallback(() => {
        const url = 'https://docs.google.com/forms/d/e/1FAIpQLScoKW2NUQVcd2fFK24riBVg2NDe6rHYcxeBa8QARNmP6xYfow/viewform?usp=pp_url'
        const params = `&entry.1052454545=${charityDetails.itemTitle}&entry.1914114789=${charityDetails.itemId}`
            + `&entry.1015569138=${potDetails.itemFullTitle}&entry.572377536=${potDetails.itemId}`
        openInNewTab(url + params)
    }, [charityDetails, openInNewTab, potDetails])

    const mappedCharities = allCharities.map(c => {
        return {...c, title: c.name}
    })

    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}

    const potFullTitle = useCallback((pot) => {
        return `Pot ${pot.potNumber} - ${pot.title}`
    }, [])

    const charityFullTitle = useCallback((charity) => {
        return charity.name
    }, [])

    return (

        <div style={{paddingBottom: 32}}>
            <RaffleSubHead text={'ENTRY FORM - Testing Only'}/>


            <div style={{...style, padding: 20}}>
                <div style={{fontSize: '1.3rem', fontWeight: 500, marginBottom: 8}}>About Your Donation</div>
                <RaffleAutocompleteBox allItems={mappedCharities}
                                       setItemDetails={setCharityDetails}
                                       getOptionTitle={charityFullTitle}
                                       searchText={'Search Charities'}/>
            </div>


            <div style={{...style, padding: 20}}>
                <div style={{fontSize: '1.3rem', fontWeight: 500, marginBottom: 8}}>Your Pot</div>

                <RaffleAutocompleteBox allItems={allPots}
                                       setItemDetails={setPotDetails}
                                       getOptionTitle={potFullTitle}
                                       searchText={'Search Pots'}/>
            </div>


            <Box style={{...style, textAlign: 'center', marginTop: 16}}>
                <Button color='success' size='small' variant='contained' onClick={handleSubmit}
                        disabled={!formComplete}>CONTINUE</Button>
            </Box>


        </div>

    )
}

export default RaffleEntryForm
