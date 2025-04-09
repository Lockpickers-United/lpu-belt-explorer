import React, {useCallback, useContext} from 'react'
import Dialog from '@mui/material/Dialog'
import {danBelts} from '../data/belts'
import SelectBox from '../formUtils/SelectBox.jsx'
import AuthContext from '../app/AuthContext.jsx'

export default function RequestRankingSelect({entry, showRankingSelect, setShowRankingSelect, form, setForm}) {

    const {userClaims} = useContext(AuthContext)

    if (!userClaims.admin && !userClaims.requestAdmin) {
        return null
    }
    const requestBelts = danBelts.filter(belt => !['Unranked', 'Project'].includes(belt))

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
        setShowRankingSelect(false)
    }, [form, setForm, setShowRankingSelect])

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
                           name='belt' form={form}
                           optionsList={requestBelts}
                           multiple={false} defaultValue={entry.belt || ''}
                           size={'large'} width={200}/>
                </div>
        </Dialog>


        </React.Fragment>
    )
}