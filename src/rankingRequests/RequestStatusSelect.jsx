import React, {useCallback, useContext, useState} from 'react'
import DBContext from '../app/DBContext.jsx'
import dayjs from 'dayjs'
import SelectBox from '../content/SelectBox.jsx'
import RequestRankingSelect from './RequestRankingSelect.jsx'
import {requestStatuses} from './rankingRequestData'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'

export default function RequestStatusSelect({entry, requestMod}) {
    const {acceptRankingRequest, updateRankingRequest} = useContext(DBContext)
    const [showRankingSelect, setShowRankingSelect] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleSnackbar = useCallback((response) => {
        if (response.success) {
            enqueueSnackbar('Request status updated')
        } else {
            enqueueSnackbar(`Error updating request status: ${response.message}`, {variant: 'error'})
        }
    }, [])

    const handleFormChange = useCallback(async (event) => {
        const newStatus = event.target.value
        const updatedEntry = {
            ...entry.originalEntry,
            requestStatus: newStatus,
            lastUpdated: dayjs().toISOString()
        }
        if (entry.requestStatus === 'Pending') {
            acceptRankingRequest(updatedEntry)
        }
        if (newStatus === 'Ranked') {
            setShowRankingSelect(true)
        } else if (newStatus === 'Deleted') {
            setShowDeleteConfirm(true)
        } else if (!['Ranked', 'Completed'].includes(newStatus)) {
            delete updatedEntry.belt
            await updateRankingRequest(updatedEntry)
                .then(response => handleSnackbar(response))
        } else {
            await updateRankingRequest(updatedEntry)
                .then(response => handleSnackbar(response))
        }
    }, [acceptRankingRequest, entry, handleSnackbar, updateRankingRequest])

    const handleDelete = useCallback(async () => {
        const updatedEntry = {
            ...entry.originalEntry,
            requestStatus: 'Deleted',
            lastUpdated: dayjs().toISOString()
        }
        await updateRankingRequest(updatedEntry)
            .then(response => handleSnackbar(response))
        setShowDeleteConfirm(false)
    }, [entry, handleSnackbar, updateRankingRequest])

    return (
        <React.Fragment>
            {requestMod &&
                <SelectBox changeHandler={handleFormChange}
                           name='requestStatus' form={{}}
                           optionsList={requestStatuses} multiple={false}
                           value={entry.requestStatus} defaultValue={entry.requestStatus}
                           size={'small'} width={160}/>
            }

            {requestMod && entry.requestStatus === 'Ranked' &&
                <Button onClick={() => setShowRankingSelect(true)} variant='contained' color='info'
                        style={{padding: '8px 8px'}}>
                    CHANGE RANKING
                </Button>
            }

            {showRankingSelect &&
                <RequestRankingSelect entry={entry} form={{}}
                                      showRankingSelect={showRankingSelect}
                                      setShowRankingSelect={setShowRankingSelect}/>
            }

            <Dialog open={showDeleteConfirm} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
            }}>
                <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                    <div style={{fontSize: '1.3rem', fontWeight: 500, marginBottom: 20, textAlign: 'center'}}>
                        Are you sure you want to delete?<br/>
                        Action cannot be undone.<br/>
                    </div>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <Button onClick={handleDelete} variant='contained' color='error'
                                style={{marginLeft: 'auto', marginRight: 'auto'}}>
                            DELETE
                        </Button>
                    </div>

                </div>
            </Dialog>

        </React.Fragment>
    )
}

