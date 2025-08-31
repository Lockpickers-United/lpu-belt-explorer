import React, {useCallback} from 'react'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RaffleDonationForm from './RaffleDonationForm.jsx'

export default function RaffleDonationConfigurator({donationData, setDonationData, showIssues, questionStyle}) {

  const addDonation = useCallback(() => {
    setDonationData([...(donationData || []), {amount: '', receipt: ''}])
  }, [donationData, setDonationData])

  const removeDonation = useCallback((index) => {
    const newData = [...(donationData || [])]
    newData.splice(index, 1)
    setDonationData(newData.length ? newData : [{amount: '', receipt: ''}])
  }, [donationData, setDonationData])

  const handleDonationChange = useCallback((index, details) => {
    const newData = [...(donationData || [])]
    newData[index] = details
    setDonationData(newData)
  }, [donationData, setDonationData])

  const divider = (donationData || []).length > 1
        ? <div style={{height: 0, margin: '20px 0px', borderBottom: '2px solid #bbb', alignItems: 'center'}}/>
        : null

  return (
    <React.Fragment>
      {(donationData || []).map((_, idx) => (
        <RaffleDonationForm key={idx} index={idx}
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
