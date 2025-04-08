import React, {useCallback, useContext, useState} from 'react'
import Dialog from '@mui/material/Dialog'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import {uniqueBelts} from '../data/belts'
import SelectBox from '../content/SelectBox.jsx'
import AuthContext from '../app/AuthContext.jsx'
import DataContext from '../context/DataContext.jsx'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import postRequestUpdate from './PostRequestUpdate.jsx'

export default function RequestRankingSelect({entry, form, setForm, setShowRankingSelect}) {

    const {user} = useContext(AuthContext)
    const {serverUrl} = useContext(DataContext)
    const [loading, setLoading] = useState(false)
    const [resStatus, setResStatus] = useState(undefined)

    const handleFormChange = useCallback(async (event) => {
        setLoading(true)
        const {name, value} = event.target
        setForm({...form, [name]: value})
        const updatedEntry = {
            ...entry.originalEntry,
            requestStatus: 'Ranked',
            belt: event.target.value,
            lastUpdated: dayjs().toISOString()
        }
        await postRequestUpdate({entry: updatedEntry, user, serverUrl})
            .then(res => {
                setResStatus(res.status)
            })
        setLoading(false)
    }, [entry, form, serverUrl, setForm, user])

    const handleClose = useCallback(() => {
        setResStatus(undefined)
        setLoading(false)
        setShowRankingSelect(false)
    }, [setShowRankingSelect])

    return (
        <React.Fragment>

            <Dialog open={!loading && !resStatus}
                    componentsProps={{backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}}}>
                <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                    <div style={{fontSize: '1.7rem', fontWeight: 500, marginBottom: 20, textAlign: 'center'}}>
                        Select ranking
                    </div>
                <SelectBox changeHandler={handleFormChange}
                           name='ranking' form={form}
                           optionsList={uniqueBelts}
                           multiple={false} defaultValue={entry.belt || ''}
                           size={'large'} width={200}/>
                </div>

        </Dialog>

            <Dialog open={loading}
                    componentsProps={{backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}}}>
                <div style={{width: 320, textAlign: 'center', padding: 30}}>
                    <LoadingDisplay/>
                </div>
            </Dialog>

            <Dialog open={!loading && !!resStatus && resStatus !== 200} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
            }}>
                <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                    <div style={{fontSize: '1.7rem', fontWeight: 500, marginBottom: 20, textAlign: 'center'}}>
                        Something went wrong.<br/>
                        Please try again later.<br/>
                    </div>
                    <div style={{fontSize: '0.85rem', fontWeight: 400, marginBottom: 20, textAlign: 'center'}}>
                        Error message: {resStatus}
                    </div>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <Button onClick={handleClose} variant='contained' color='error'
                                style={{marginLeft: 'auto', marginRight: 'auto'}}>
                            OK
                        </Button>
                    </div>

                </div>
            </Dialog>


        </React.Fragment>
    )
}