import React, {useCallback, useContext, useState} from 'react'
import DBContext from '../app/DBContext.jsx'
import dayjs from 'dayjs'
import SelectBox from '../content/SelectBox.jsx'
import RequestRankingSelect from './RequestRankingSelect.jsx'
import postRequestUpdate from './PostRequestUpdate.jsx'
import AuthContext from '../app/AuthContext.jsx'
import {serverUrl, requestStatuses} from './requestData'

export default function RequestStatusSelect({entry, requestMod}) {
    const {user} = useContext(AuthContext)

    const {acceptRankingRequest} = useContext(DBContext)
    const [showRankingSelect, setShowRankingSelect] = useState(false)

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
        } else if (!['Ranked', 'Completed'].includes(newStatus)) {
            const updatedEntry = {
                ...entry.originalEntry,
                requestStatus: newStatus,
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
                requestStatus: newStatus,
                lastUpdated: dayjs().toISOString()
            }
            await postRequestUpdate({entry: updatedEntry, user, serverUrl})
                .then(res => {
                    console.log('res', res)
                })
        }
    }, [acceptRankingRequest, entry, user])


    return (
        <React.Fragment>
            {requestMod
                ? <SelectBox changeHandler={handleFormChange}
                             name='requestStatus' form={{}}
                             optionsList={requestStatuses} multiple={false}
                             value={entry.requestStatus} defaultValue={entry.requestStatus}
                             size={'small'} width={200}/>
                : <span>{entry.status}</span>
            }

            {showRankingSelect &&
                <RequestRankingSelect entry={entry} form={{}}
                                      showRankingSelect={showRankingSelect}
                                      setShowRankingSelect={setShowRankingSelect} />
            }

        </React.Fragment>
    )
}

