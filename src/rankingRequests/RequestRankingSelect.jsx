import React, {useCallback, useContext} from 'react'
import Dialog from '@mui/material/Dialog'
import {danBelts} from '../data/belts'
import SelectBox from '../content/SelectBox.jsx'
import AuthContext from '../app/AuthContext.jsx'
import dayjs from 'dayjs'
import {enqueueSnackbar} from 'notistack'
import DBContext from '../app/DBContext.jsx'

export default function RequestRankingSelect({entry, showRankingSelect, setShowRankingSelect}) {

    const {userClaims} = useContext(AuthContext)

    if (!userClaims.admin && !userClaims.requestAdmin) {
        return null
    }
    const {updateRankingRequest} = useContext(DBContext)
    const requestBelts = danBelts.filter(belt => !['Unranked', 'Project'].includes(belt))

    const handleSnackbar = useCallback((response) => {
        if (response.success) {
            enqueueSnackbar('Request status updated')
        } else {
            enqueueSnackbar(`Error updating request status: ${response.message}`, {variant: 'error'})
        }
    }, [])

    const handleFormChange = useCallback(async (event) => {
        const updatedEntry = {
            ...entry.originalEntry,
            requestStatus: 'Ranked',
            belt: event.target.value,
            lastUpdated: dayjs().toISOString()
        }
        await updateRankingRequest(updatedEntry)
            .then(response => handleSnackbar(response))
        setShowRankingSelect(false)
    }, [entry.originalEntry, handleSnackbar, setShowRankingSelect, updateRankingRequest])

    const handleClose = useCallback(() => {
        setShowRankingSelect(false)
    }, [setShowRankingSelect])

    return (
        <React.Fragment>

            <Dialog open={showRankingSelect} onClose={handleClose}
                    componentsProps={{backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}}}>
                <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                    <div style={{fontSize: '1.7rem', fontWeight: 500, marginBottom: 20, textAlign: 'center'}}>
                        Select ranking
                    </div>
                <SelectBox changeHandler={handleFormChange}
                           name='ranking' form={{}}
                           optionsList={requestBelts}
                           multiple={false} defaultValue={entry.belt || ''}
                           size={'large'} width={200}/>
                </div>
        </Dialog>


        </React.Fragment>
    )
}