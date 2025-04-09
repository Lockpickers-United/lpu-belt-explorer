import React, {useCallback, useContext, useState} from 'react'
import DBContext from '../app/DBContext.jsx'
import dayjs from 'dayjs'
import SelectBox from '../formUtils/SelectBox.jsx'
import {requestStatuses} from './rankingRequestData'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'
import {danBelts} from '../data/belts'

export default function RequestStatusSelect({entry, requestMod, form, setForm, setShowEditRequest}) {
    const {updateRankingRequest} = useContext(DBContext)
    const [showRankingSelect, setShowRankingSelect] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const requestBelts = danBelts.filter(belt => !['Unranked', 'Project'].includes(belt))

    const handleSnackbar = useCallback((response) => {
        if (response.success) {
            enqueueSnackbar('Request status updated')
        } else {
            enqueueSnackbar(`Error updating request status: ${response.message}`, {variant: 'error'})
        }
    }, [])

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        if (name === 'requestStatus' && value === 'Ranked') {
            setShowRankingSelect(true)
        } else if (name === 'requestStatus' && value === 'Deleted') {
            setShowDeleteConfirm(true)
        } else if (name === 'requestStatus') {
            setShowRankingSelect(false)
            delete form.belt
        }
        setForm({...form, [name]: value})
    }, [form, setForm])

    const handleDelete = useCallback(async () => {
        const updatedEntry = {
            ...entry.originalEntry,
            requestStatus: 'Deleted',
            lastUpdated: dayjs().toISOString()
        }
        await updateRankingRequest(updatedEntry)
            .then(response => handleSnackbar(response))
        setShowDeleteConfirm(false)
        setShowEditRequest(false)
    }, [entry.originalEntry, handleSnackbar, setShowEditRequest, updateRankingRequest])

    const handleClose = useCallback(() => {
        setShowDeleteConfirm(false)
    }, [setShowDeleteConfirm])

    return (
        <React.Fragment>
            {requestMod &&
                <div style={{marginTop: 10}}>
                    <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>Status</div>
                    <SelectBox changeHandler={handleFormChange}
                               name='requestStatus' form={{}}
                               optionsList={requestStatuses} multiple={false}
                               value={form.requestStatus || entry.requestStatus} defaultValue={form.requestStatus || entry.requestStatus}
                               size={'small'} width={200}/>
                </div>
            }

            {requestMod && (form.belt || showRankingSelect) &&
                <div style={{marginTop: 8}}>
                <SelectBox changeHandler={handleFormChange}
                           name='belt' form={form}
                           optionsList={requestBelts}
                           multiple={false} defaultValue={entry.belt || ''}
                           size={'small'} width={200} label={'belt'}/>
                </div>
            }

            <Dialog open={showDeleteConfirm} onClose={handleClose} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
            }}>
                <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                    <div style={{fontSize: '1.3rem', fontWeight: 500, marginBottom: 20, textAlign: 'center'}}>
                        Are you sure you want to delete?<br/>
                        Action cannot be undone.<br/>
                    </div>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <Button onClick={handleClose} variant='contained' color='success'
                                style={{marginRight: 20, backgroundColor: '#999'}}>
                            CANCEL
                        </Button>
                        <Button onClick={handleDelete} variant='contained' color='error'>
                            DELETE
                        </Button>
                    </div>
                </div>
            </Dialog>

        </React.Fragment>
    )
}

