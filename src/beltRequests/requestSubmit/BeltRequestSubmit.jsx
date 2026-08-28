import React, {useCallback, useEffect, useMemo} from 'react'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import Tracker from '../../app/Tracker.jsx'
import allEntries from '../../data/data.json'
import useForm from '../../formUtils/useForm.jsx'
import FormElement from '../../formUtils/FormElement.jsx'
import {uniqueBelts} from '../../data/belts'
import LoadingDisplayWhiteSmall from '../../misc/LoadingDisplayWhiteSmall.jsx'
import RequestBeltRequirements from './RequestBeltRequirements.jsx'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import isValidUrl from '../../util/isValidUrl'

/**
 * @prop photoCredit
 */

export default function BeltRequestSubmit() {

    let form

    const processChange = useCallback((event) => {
        const {name, value} = event.target
        console.log('processChange called', name, value)
        let events = [event]
        if (name === 'requestBelt') {
            form.update({target: {name: 'readRequirements', action: 'delete'}})
        }
        return events
    }, [form])

    const baseForm = useMemo(() => {
        return {}
    }, [])

    const processSubmit = useCallback((form) => {
        console.log('processSubmit called')

        const newForm = {...form}
        // pre process
        return newForm
    }, [])

    const handleSubmit = useCallback((_form) => {
        console.log('handleSubmit called')
        //    const {saveSurveySubmission} = useContext(DBContext)
    }, [])

    form = useForm({baseForm, processChange, processSubmit, handleSubmit})

    useEffect(() => {
        if (!form.intialized) {
            form.initialize({
                requiredFields: ['requestBelt', 'readRequirements', 'lock1', 'lock1evidence']
            })
        }
        if(form.form?.requestBelt === 'Blue') form.require(['blueBeltProjectInfo'])
    }, [form])

    console.log('form', form)

    const beltIndex = useMemo(() => uniqueBelts.indexOf(form.form?.requestBelt), [form])
    const lockCount = useMemo(() => beltIndex <= 4
        ? 1
        : beltIndex <= 7
            ? 2
            : 6
        ,[beltIndex])

    const checkValidLockBelt = useCallback(lockDetails => {
        return uniqueBelts.indexOf(lockDetails?.belt) >= uniqueBelts.indexOf(form.form?.requestBelt)
    }, [form])

    const checkValidUrl = useCallback(value => {
        return isValidUrl(value)
    }, [])

    const allLockFieldNames = ['lock1', 'lock2', 'lock3', 'lock4', 'lock5', 'lock6']
    const lockFieldNames = allLockFieldNames.slice(0, lockCount)
    const allEvidenceFieldNames = ['lock1evidence', 'lock2evidence', 'lock3evidence',
        'lock4evidence', 'lock5evidence', 'lock6evidence']
    const evidenceFieldNames = allEvidenceFieldNames.slice(0, lockCount)

    const sectionCount = 3

    return (

        <div style={{
            maxWidth: 800, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
        }}>

            <FormElement fieldType={'SectionHeader'}
                         label={'Choose Belt'}
                         options={[1, sectionCount]}/>

            <FormElement fieldType={'SelectBox'}
                         fieldName={'requestBelt'}
                         description={'What belt are you requesting?'}
                         options={uniqueBelts}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 140}}
                         form={form}
                         formDefaults={formDefaults}/>

            <FormElement fieldType={'SectionHeader'}
                         label={'Belt Requirements'}
                         options={[2, sectionCount]}/>

            <Collapse in={!form.form?.requestBelt}>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 14, marginBottom: 6, color: '#999'}}>
                    Please select a belt to continue.
                </div>
            </Collapse>

            <Collapse in={!!form.form?.requestBelt}>
                <RequestBeltRequirements belt={form.form?.requestBelt}/>
                <div style={{marginTop: 24}}/>
                <FormElement fieldType={'SingleCheckbox'}
                             fieldName={'readRequirements'}
                             description={''}
                             options={['I have read and completed all of the requirements for this belt.']}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                 inputWidth: 20,
                                 color: 'success',
                                 fontWeight: 700
                             }}
                             form={form}
                             formDefaults={formDefaults}/>
            </Collapse>

            <FormElement fieldType={'SectionHeader'}
                         label={'Evidence'}
                         options={[3, sectionCount]}/>

            <Collapse in={!form.form?.requestBelt || !form.form?.readRequirements}>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 14, marginBottom: 6, color: '#999'}}>
                    {!form.form?.requestBelt ? 'Please select a belt to continue.' : 'Please indicate that you have read the requirements above to continue.'}
                </div>
            </Collapse>

            <Collapse in={!!form.form?.requestBelt && !!form.form?.readRequirements}>

                {lockFieldNames.map((lockFieldName, idx) => (
                    <div key={idx} style={{marginBottom: 44}}>

                        <FormElement fieldType={'LockEntrySearchBox'}
                                     fieldName={lockFieldName}
                                     description={'Select lock #' + (idx + 1) + `${idx > 1 ? ' (optional)' : ''}`}
                                     options={allEntries}
                                     fieldSettings={{
                                         descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                         inputWidth: 600
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}
                                     checkValid={checkValidLockBelt}/>
                        <FormElement fieldType={'TextField'}
                                     fieldName={evidenceFieldNames[idx]}
                                     description={'Link to evidence'}
                                     fieldSettings={{
                                         descriptionStyle: {fontSize: '1.1rem', fontWeight: 400, color:'#ddd'},
                                         margin: '0px 0px 16px 0px',
                                         inputWidth: '100%'
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}
                                     checkValid={checkValidUrl}/>
                    </div>
                ))}

                <FormElement fieldType={'TextField'}
                             fieldName={'blueBeltProjectInfo'}
                             label={'Blue Belt Project Info (Required)'}
                             multiline={true}
                             rows={4}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                 inputWidth: '100%'
                             }}
                             form={form}
                             formDefaults={formDefaults}/>

                <FormElement fieldType={'TextField'}
                             fieldName={'notes'}
                             description={'Any notes or other important information?'}
                             multiline={true}
                             rows={4}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                 inputWidth: '100%'
                             }}
                             form={form}
                             formDefaults={formDefaults}/>

            </Collapse>


            <div style={{display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 16}}>
                <Button onClick={form.submit} variant='contained' color='info'
                        disabled={!form.canSave} style={{boxShadow: 'none'}}>
                    {form.updating
                        ? <LoadingDisplayWhiteSmall size={'small'}/>
                        : 'SUBMIT'
                    }
                </Button>
            </div>


            <Dialog open={form.submitted} slotProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.8}}
            }}>
                <div style={{display: 'flex'}}>
                    <Paper sx={{marginLeft: 'auto', marginRight: 'auto', padding: '40px'}}>
                        <Typography sx={{
                            fontSize: '1.7rem',
                            fontWeight: 500,
                            marginBottom: '60px',
                            textAlign: 'center'
                        }}>Request Submitted!
                        </Typography>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <Button onClick={form.reload} variant='contained' color='success'
                                    style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                OK
                            </Button>
                        </div>
                    </Paper>
                </div>
            </Dialog>

            <Tracker feature='beltRequest'/>
        </div>
    )
}

const formDefaults = {
    margin: '0px 0px 32px 0px',
    labelStyle: {fontSize: '1.0rem', fontWeight: 700},
    descriptionStyle: {fontSize: '1.0rem', fontWeight: 400},
    sectionHeaderStyle: {},
    sectionHeaderInfoStyle: {},
    inputWidth: 80,
    inputSize: 'small',
    color: 'info'
}
