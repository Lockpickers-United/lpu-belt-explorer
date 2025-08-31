import React, {useCallback} from 'react'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RaffleDonationForm from './RaffleDonationForm.jsx'

export default function RaffleDonationConfigurator({donationData, setDonationData, showIssues, questionStyle}) {
  const donationKeys = Object.keys(donationData)

  const addDonation = useCallback(() => {
    const next = (parseInt(donationKeys[donationKeys.length-1]) || 0) + 1000
    const newData = {...donationData}
    newData[next] = {amount: '', receipt: ''}
    setDonationData(newData)
  }, [donationData, donationKeys, setDonationData])

  const removeDonation = useCallback((index) => {
    const newData = {...donationData}
    delete newData[index]
    setDonationData(newData)
  }, [donationData, setDonationData])

  const handleDonationChange = useCallback((index, details) => {
    const newData = {...donationData}
    newData[index] = details
    setDonationData(newData)
  }, [donationData, setDonationData])

    const divider = Object.keys(donationData).length > 1
        ? <div style={{height: 0, margin: '20px 0px', borderBottom: '2px solid #bbb', alignItems: 'center'}}/>
        : null

    return (
    <React.Fragment>
      {donationKeys.map(key => (
        <RaffleDonationForm key={key} index={key}
                            donationData={donationData}
                            handleDonationChange={handleDonationChange}
                            removeDonation={removeDonation}
                            showIssues={showIssues}
                            questionStyle={questionStyle}
        />
      ))}
        {divider}
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button variant='outlined' onClick={addDonation} size='small' color='info' startIcon={<AddCircleIcon/>}>
          Add Donation
        </Button>
      </div>
    </React.Fragment>
  )
}
