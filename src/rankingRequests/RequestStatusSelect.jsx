import React, {useCallback, useEffect, useState} from 'react'
import SelectBox from '../formUtils/SelectBox.jsx'
import {requestStatuses} from './rankingRequestData'
import {danBelts} from '../data/belts'

export default function RequestStatusSelect({entry, requestMod, form, setForm, setUpdated}) {
    const [showRankingSelect, setShowRankingSelect] = useState(false)
    const requestBelts = danBelts.filter(belt => !['Unranked', 'Project'].includes(belt))

    useEffect(() => {
        setTimeout(() => {
            setForm({
                make: entry.makeModels ? entry.makeModels[0].make : '',
                model: entry.makeModels ? entry.makeModels[0].model : '',
                requestStatus: entry.requestStatus,
                belt: entry.belt
            })
        },100)
    }, [entry, setForm])

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        if (name === 'requestStatus' && value === 'Ranked') {
            setShowRankingSelect(true)
        } else if (name === 'requestStatus') {
            setShowRankingSelect(false)
            delete form.belt
        }
        setForm({...form, [name]: value})
        setUpdated(true)
    }, [form, setForm, setUpdated])

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
        </React.Fragment>
    )
}

