import React, {useCallback, memo} from 'react'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RaffleDonationForm from './RaffleDonationForm.jsx'

function RaffleDonationConfigurator({donationData, setDonationData, showIssues, questionStyle}) {

  const addDonation = useCallback(() => {
    setDonationData(prev => ([...(prev || []), {amount: 0, receipt: ''}]))
  }, [setDonationData])

  const removeDonation = useCallback((index) => {
    setDonationData(prev => {
      const list = [...(prev || [])]
      list.splice(index, 1)
      return list.length ? list : [{amount: 0, receipt: ''}]
    })
  }, [setDonationData])

  const handleDonationChange = useCallback((index, details) => {
    setDonationData(prev => {
      const list = [...(prev || [])]
      list[index] = details
      return list
    })
  }, [setDonationData])

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

export default memo(RaffleDonationConfigurator)
