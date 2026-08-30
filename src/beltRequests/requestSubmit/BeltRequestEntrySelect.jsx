import React, {useCallback, useMemo, useState} from 'react'
import ScorecardEntrySearchBox from '../../formUtils/ScorecardEntrySearchBox.jsx'
import BeltIcon from '../../entries/BeltIcon.jsx'
import Typography from '@mui/material/Typography/index.d.ts'
import ChoiceButtonGroupNew from '../../util/ChoiceButtonGroupNew.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import {beltRoles, uniqueBelts} from '../../data/belts'
import isValidUrl from '../../util/isValidUrl'
import LockEntrySearchBox from '../../formUtils/LockEntrySearchBox.jsx'
import allEntries from '../../data/data.json'
import TextField from '@mui/material/TextField'

export default function BeltRequestEntrySelect({scorecardEntries, fieldName, form = {}, entryNumber}) {

    const [source, setSource] = useState('scorecard')
    const handleChangeSource = useCallback((option) => {
        setSource(option.value)
        form.update({target: {name: fieldName, action: 'delete'}})
    }, [fieldName, form])

    const beltIndex = useMemo(() => beltRoles.indexOf(form.form.requestBelt), [form])
    const existingIds = useMemo(() => Object.keys(form.form)
        .filter(key => key.startsWith('entry'))
        .map(key => form.form[key].id)
        .filter(x => x), [form.form])
    const duplicateIds = existingIds.filter((id, index) => existingIds.findIndex(i => i === id) !== index)

    const lockEntries = allEntries.filter((entry) => (beltIndex === -1 || beltRoles.indexOf(entry.belt + ' Belt') >= beltIndex))

    const handleChangeEntry = useCallback((details) => {
        console.log('handleChangeEntry', details)
        if (details?.lockName) {
            form.update({target: {name: fieldName, value: details}})
        } else {
            form.update({target: {name: fieldName, action: 'delete'}})
        }
    }, [fieldName, form])

    const handleChangeLink = useCallback((event) => {
        console.log(event.target.value)
        if (event.target.value.length) {
            form.update({target: {name: fieldName, value: {...form.form[fieldName], link: event.target.value}}})
        } else {
            form.update({target: {name: fieldName, value: {...form.form[fieldName], link: undefined}}})
        }
    }, [fieldName, form])

    const checkValidLockBelt = useCallback(() => {
        return uniqueBelts.indexOf(form.form?.[fieldName]?.belt) >= uniqueBelts.indexOf(form.form?.requestBelt)
    }, [fieldName, form.form])

    const checkValidUrl = useCallback(value => {
        return isValidUrl(value)
    }, [])

    const isValid = useMemo(() => {
        return form.form?.[fieldName]
            && checkValidLockBelt(form.form?.[fieldName])
            && checkValidUrl(form.form?.[fieldName]?.link)
            && !duplicateIds.includes(form.form?.[fieldName]?.id)
    }, [checkValidLockBelt, form.form, fieldName, checkValidUrl, duplicateIds])

    const isNotValid = useMemo(() => {
        return (
            form.form?.[fieldName]?.link
            && (!checkValidLockBelt(form.form?.[fieldName]) || !checkValidUrl(form.form?.[fieldName]?.link))
            || duplicateIds.includes(form.form?.[fieldName]?.id)
        )
    }, [checkValidLockBelt, form.form, fieldName, checkValidUrl, duplicateIds])

    const options = useMemo(() => {
        return [
            {label: 'From Scorecard', value: 'scorecard'},
            {label: 'Select Lock', value: 'selectLock'}
        ]
    }, [])

    return (

        <div style={{margin: 0}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                <Typography sx={{fontSize: '1.2rem', fontWeight: 500}}>
                    SELECT LOCK #{entryNumber}
                </Typography>
                <ChoiceButtonGroupNew
                    options={options}
                    defaultValue={source}
                    onChange={handleChangeSource}
                    small={false}
                    style={{margin: '0px 8px', borderRadius: 0}}
                    buttonStyle={{fontSize: '0.8rem'}}
                />
            </div>

            <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{marginRight: 10, width: 32}}>
                    <BeltIcon value={form.form?.[fieldName] ? form.form[fieldName].belt : null}/>
                </div>
                <div style={{width: '100%'}}>

                    {source === 'scorecard'
                        ? <>
                            <ScorecardEntrySearchBox handleChangeScorecardEntry={handleChangeEntry}
                                                     scorecardEntries={scorecardEntries}/>
                            <div style={{display: 'flex', alignItems: 'center', marginTop: 10, height: 32}}>
                                {form.form?.[fieldName] &&
                                    form.form[fieldName].link
                                }
                            </div>
                        </>

                        : <div>
                            <LockEntrySearchBox handleChangeLock={handleChangeEntry} allEntries={lockEntries}
                                                lockIndex={0}/>
                            <div style={{marginTop: 10}}>
                                Link to evidence
                                <TextField type='text'
                                           name={fieldName}
                                           style={{margin: '6px 0px 0px 0px'}}
                                           fullWidth
                                           size={'small'}
                                           onChange={handleChangeLink}
                                           value={form.form[fieldName]?.link || ''}
                                           color={(form.form[fieldName]?.link && !checkValidUrl(form.form[fieldName].link)) ? 'error' : 'info'}/>
                            </div>

                        </div>
                    }
                </div>
                <div style={{marginLeft: 10, width: 32}}>
                    {isNotValid && <ReportProblemIcon color='error'/>}
                    {isValid && <CheckCircleIcon color='success'/>}
                </div>

            </div>
        </div>

    )
}