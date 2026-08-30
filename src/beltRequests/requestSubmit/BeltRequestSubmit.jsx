import React, {useCallback, useContext, useEffect, useMemo} from 'react'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import Tracker from '../../app/Tracker.jsx'
import useForm from '../../formUtils/useForm.jsx'
import FormElement from '../../formUtils/FormElement.jsx'
import {beltRoles, danBeltsFull} from '../../data/belts'
import LoadingDisplayWhiteSmall from '../../misc/LoadingDisplayWhiteSmall.jsx'
import RequestBeltRequirements from './RequestBeltRequirements.jsx'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import ScorecardDataContext from '../../scorecard/ScorecardDataProvider.jsx'
import BeltRequestEntrySelect from './BeltRequestEntrySelect.jsx'

/**
 * @prop requestBelt
 * @prop readRequirements
 */

export default function BeltRequestSubmit() {
    const {
        visibleEntries = []
        //cardMaxBelt
    } = useContext(ScorecardDataContext)

    let form

    const processChange = useCallback((event) => {
        const {name, value} = event.target
        let events = [event]
        if (name === 'requestBelt') form.reload()
        if (name === 'requestBelt' && value.includes('Blue')) form.require(['blueBeltProjectInfo'])
        if (name === 'requestBelt' && value.includes('Dan')) events.push({
            target: {
                name: 'readRequirements',
                value: true
            }
        })
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
                requiredFields: ['requestBelt', 'readRequirements', 'entry1']
            })
        }
    }, [form])

    console.log('form', form)

    const beltIndex = useMemo(() => beltRoles.indexOf(form.form.requestBelt), [form])
    const lockCount = useMemo(() => beltIndex <= 4
            ? 1
            : beltIndex <= 7
                ? 2
                : beltIndex <= 8
                    ? 6
                    : 0
        , [beltIndex])

    const scorecardEntries = useMemo(() => visibleEntries.filter(entry =>
        (entry.type === 'Lock'
            && !entry.exceptionType
            && !!entry.belt
            && (beltIndex === -1 || danBeltsFull.indexOf(entry.belt) >= beltIndex)
        )
    ), [visibleEntries, beltIndex])

    const allEntryFieldNames = useMemo(() => ['entry1', 'entry2', 'entry3', 'entry4', 'entry5', 'entry6'], [])
    const entryFieldNames = useMemo(() => {
        return allEntryFieldNames.slice(0, lockCount) || []
    }, [allEntryFieldNames, lockCount])

    useEffect(() => {
        if (!entryFieldNames.slice(0, 2).every(field => form.required?.includes(field))) {
            form.require(entryFieldNames.slice(0, 2))
        }
        if (form.form.requestBelt?.includes('Blue') && !form.required?.includes('blueBeltProjectInfo')) {
            form.require(['blueBeltProjectInfo'])
        }
    }, [entryFieldNames, form])

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
                         options={beltRoles}
                         fieldSettings={{descriptionStyle: {fontSize: '1.1rem', fontWeight: 500}, inputWidth: 140}}
                         form={form}
                         formDefaults={formDefaults}/>

            <FormElement fieldType={'SectionHeader'}
                         label={'Belt Requirements'}
                         options={[2, sectionCount]}/>

            <Collapse in={!form.form.requestBelt}>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 14, marginBottom: 6, color: '#999'}}>
                    Please select a belt to continue.
                </div>
            </Collapse>

            <Collapse in={!!form.form.requestBelt}>
                <RequestBeltRequirements belt={form.form.requestBelt?.replace(' Belt', '')}/>
                <div style={{marginTop: 24}}/>
                <FormElement fieldType={'SingleCheckbox'}
                             fieldName={'readRequirements'}
                             description={''}
                             options={['I have read and completed all of the requirements for this belt.']}
                             fieldSettings={{
                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                 inputWidth: 20,
                                 color: 'success',
                                 fontWeight: 700,
                                 margin: 0
                             }}
                             form={form}
                             formDefaults={formDefaults}/>
            </Collapse>

            <FormElement fieldType={'SectionHeader'}
                         label={'Evidence'}
                         options={[3, sectionCount]}/>

            <Collapse in={!form.form.requestBelt || !form.form.readRequirements}>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 14, marginBottom: 6, color: '#999'}}>
                    {!form.form.requestBelt ? 'Please select a belt to continue.' : 'Please indicate that you have read the requirements above to continue.'}
                </div>
            </Collapse>

            <Collapse in={!!form.form.requestBelt && !!form.form.readRequirements}>

                {!!form.form.requestBelt && !!form.form.readRequirements &&
                    <>
                        {!form.form.requestBelt.includes('Dan') && entryFieldNames.map((entryFieldName, idx) => (
                            <div key={idx} style={{margin: '12px 0 18px 0'}}>
                                <BeltRequestEntrySelect scorecardEntries={scorecardEntries}
                                                        fieldName={entryFieldName}
                                                        form={form}
                                                        entryNumber={idx + 1}/>

                            </div>
                        ))}

                        {form.form.requestBelt.includes('Dan') &&
                            <FormElement fieldType={'TextField'}
                                         fieldName={'danRequestEvidence'}
                                         label={'Link to Dan Evidence'}
                                         fieldSettings={{
                                             descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                             inputWidth: '100%'
                                         }}
                                         form={form}
                                         formDefaults={formDefaults}/>
                        }

                        {form.form.requestBelt === 'Blue Belt' &&
                            <FormElement fieldType={'TextField'}
                                         fieldName={'blueBeltProjectInfo'}
                                         label={'Blue Belt Project Info (Required)'}
                                         multiline={true}
                                         rows={4}
                                         fieldSettings={{
                                             descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                             inputWidth: '100%',
                                             margin: '24px 0 0'
                                         }}
                                         form={form}
                                         formDefaults={formDefaults}/>
                        }

                        <FormElement fieldType={'TextField'}
                                     fieldName={'notes'}
                                     description={'Any notes or required information?'}
                                     multiline={true}
                                     rows={4}
                                     fieldSettings={{
                                         descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                         inputWidth: '100%'
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}/>

                    </>
                }
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
