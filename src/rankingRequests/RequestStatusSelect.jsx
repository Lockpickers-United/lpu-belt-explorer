import React, {useCallback, useContext, useState} from 'react'
import DBContext from '../app/DBContext.jsx'
import dayjs from 'dayjs'
import SelectBox from '../content/SelectBox.jsx'
import DataContext from '../context/DataContext.jsx'
import RequestRankingSelect from './RequestRankingSelect.jsx'
import postRequestUpdate from './PostRequestUpdate.jsx'
import AuthContext from '../app/AuthContext.jsx'

export default function RequestStatusSelect({entry, requestMod, form, setForm}) {
    const {user} = useContext(AuthContext)
    const {serverUrl} = useContext(DataContext)

    const {acceptRankingRequest} = useContext(DBContext)
    const {requestStatuses} = useContext(DataContext)
    const [showRankingSelect, setShowRankingSelect] = useState(false)

    const handleFormChange = useCallback(async (event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
        const updatedEntry = {
            ...entry.originalEntry,
            requestStatus: event.target.value,
            lastUpdated: dayjs().toISOString()
        }
        if (entry.requestStatus === 'Pending') {
            acceptRankingRequest(updatedEntry)
        }

        if (event.target.value === 'Ranked') {
            setShowRankingSelect(true)
        } else if (entry.requestStatus === 'Ranked') {
            const updatedEntry = {
                ...entry.originalEntry,
                requestStatus: event.target.value,
                lastUpdated: dayjs().toISOString()
            }
            delete updatedEntry.belt
            await postRequestUpdate({entry: updatedEntry, user, serverUrl})
                .then(res => {
                    console.log('res', res)
                })

        } else {
            const updatedEntry = {
                ...entry.originalEntry,
                requestStatus: event.target.value,
                lastUpdated: dayjs().toISOString()
            }
            await postRequestUpdate({entry: updatedEntry, user, serverUrl})
                .then(res => {
                    console.log('res', res)
                })
        }
    }, [acceptRankingRequest, entry, form, serverUrl, setForm, user])


    return (
        <React.Fragment>
            {requestMod
                ? <SelectBox changeHandler={handleFormChange}
                             name='requestStatus' form={form}
                             optionsList={requestStatuses} multiple={false}
                             value={entry.status} defaultValue={entry.status}
                             size={'small'} width={200}/>
                : <span>{entry.status}</span>
            }

            {showRankingSelect &&
                <RequestRankingSelect entry={entry} form={form} setForm={setForm}
                                      showRankingSelect={showRankingSelect}
                                      setShowRankingSelect={setShowRankingSelect} />
            }

        </React.Fragment>
    )
}

