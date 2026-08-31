import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
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
import AuthContext from '../../app/AuthContext.jsx'
import handleRequestSubmit from './handleRequestSubmit'
import isValidUrl from '../../util/isValidUrl'
import BeltRequestEpicQuest from './BeltRequestEpicQuest.jsx'

/**
 * @prop requestBelt
 * @prop readRequirements
 * @prop requestPlatform
 * @prop danRequestEvidence
 */

export default function BeltRequestForm() {
    const {profile} = useContext(ScorecardDataContext)
    const {user} = useContext(AuthContext)
    const userId = user?.uid
    const {
        visibleEntries = []
        //cardMaxBelt
    } = useContext(ScorecardDataContext)


    // TODO message is no matching scorecard entries (or none to begin with)


    let form
    let entryFieldNames
    let questFieldNames
    const [lockCount, setLockCount] = useState(0)
    const [questCount, setQuestCount] = useState(0)

    const processChange = useCallback((event) => {
        const {name, value} = event.target
        //const cleanValue = sanitizeValues(value, {profanityOK: false, urlsOK: true})
        const cleanValue = (typeof value === 'string') ? value.trim() : value
        let events = [{...event, target: {name, value: cleanValue}}]

        if (name === 'requestBelt') {
            form.reload()
            setLockCount(beltRoles.indexOf(value) <= 4 ? 1 : 2)
        }
        if (name === 'requestBelt' && value.includes('Blue')) form.require(['blueBeltProjectInfo'])
        if (name === 'requestBelt' && value.includes('Black')) {
            setQuestCount(2)
            setTimeout(() => {
                form.require(['blackBeltMentoringInfo'])
            }, 100)
        }
        if (name === 'requestBelt' && value.includes('Dan')) {
            events.push({target: {name: 'readRequirements', value: true}})
            setLockCount(0)
            setQuestCount(0)
            setTimeout(() => {
                form.require(['danRequestEvidence'])
            }, 100)
        }
        if (name === 'readRequirements') {
            entryFieldNames.forEach((fieldName) => {
                form.update({target: {name: fieldName, action: 'delete'}})
            })
        }
        return events
    }, [entryFieldNames, form])

    const baseForm = useMemo(() => {
        return {}
    }, [])

    const processSubmit = useCallback((form) => {
        console.log('processSubmit called')
        handleRequestSubmit(form)
        const newForm = {...form}
        // pre-process
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
                requiredFields: ['requestBelt', 'readRequirements', 'requestPlatform'],
                clearOnSubmit: false
            })
        }
    }, [form])

    console.log('form', form)

    const beltIndex = useMemo(() => beltRoles.indexOf(form.form.requestBelt), [form])

    const scorecardEntries = useMemo(() => visibleEntries.filter(entry =>
        (entry.type === 'Lock'
            && !entry.exceptionType
            && !!entry.belt
            && (beltIndex === -1 || danBeltsFull.indexOf(entry.belt) >= beltIndex)
        )
    ), [visibleEntries, beltIndex])


    const allEntryFieldNames = useMemo(() => ['entry1', 'entry2', 'entry3', 'entry4', 'entry5', 'entry6'], [])
    const allQuestFieldNames = useMemo(() => ['quest1', 'quest2'], [])

    entryFieldNames = useMemo(() => {
        return allEntryFieldNames.slice(0, lockCount) || []
    }, [allEntryFieldNames, lockCount])

    questFieldNames = useMemo(() => {
        return allQuestFieldNames.slice(0, questCount) || []
    }, [allQuestFieldNames, questCount])

    const handleReplaceQuest = useCallback(() => {
        setLockCount(prev => prev + 2)
        setQuestCount(prev => prev - 1)
    }, [])


    const checkValidUrl = useCallback(value => {
        return isValidUrl(value)
    }, [])

    useEffect(() => {
        if (!entryFieldNames.every(field => form.required?.includes(field))) {
            form.require(entryFieldNames)
        }
        if (!questFieldNames.every(quest => form.required?.includes(quest))) {
            form.require(questFieldNames)
        }
        if (form.form.requestBelt?.includes('Blue') && !form.required?.includes('blueBeltProjectInfo')) {
            form.require(['blueBeltProjectInfo'])
        }
    }, [entryFieldNames, form, questFieldNames])

    const fillProfileLink = useCallback(() => {
        const nameVar = profile.displayName ? `?name=${profile?.displayName}` : ''
        const profileLink = `https://lpubelts.com/#/profile/${userId}/scorecard${nameVar}`
        form.update({target: {name: 'danRequestEvidence', value: profileLink}})
    }, [profile.displayName, userId, form])

    const syncPlatform = useMemo(() => form.form.requestPlatform?.includes('Discord') ? 'Reddit' : 'Discord', [form.form.requestPlatform])

    const sectionCount = 4

    return (

        <div style={{
            maxWidth: 800, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
        }}>

            <div style={{fontSize: '1.0rem', fontWeight: 400, margin: '32px 0 0'}}>
                This form makes it easy to compose your belt request to be clear and
                easy for moderators to review. Simply select the belt you&#39;re requesting
                and complete each of the steps that follow. Once you&#39;re done,
                click the &#34;Copy Request&#34; button and paste into the platform of you prefer. <strong>Please
                note</strong>: incomplete requests &mdash; or those which do not meet the belt
                requirements &mdash; may be rejected without review.
            </div>

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
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 14, color: '#999'}}>
                    Please select a belt to continue.
                </div>
            </Collapse>

            <Collapse in={!!form.form.requestBelt}>
                <>
                    <RequestBeltRequirements belt={form.form.requestBelt?.replace(' Belt', '')}/>
                    {form.form.requestBelt?.includes('Belt') && <div style={{marginTop: 24}}/>}
                    <FormElement fieldType={'SingleCheckbox'}
                                 fieldName={'readRequirements'}
                                 description={''}
                                 options={['I have read and completed all of the requirements for this belt.']}
                                 fieldSettings={{
                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                     inputWidth: 20,
                                     color: 'success',
                                     fontWeight: 700,
                                     style: {margin: 0},
                                     margin: 0
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>
                </>
            </Collapse>

            <FormElement fieldType={'SectionHeader'}
                         label={'Evidence'}
                         options={[3, sectionCount]}/>

            <Collapse in={!form.form.requestBelt || !form.form.readRequirements}>
                <>
                    {!form.form.requestBelt || !form.form.readRequirements &&
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: 14,
                            color: '#999'
                        }}>
                            {!form.form.requestBelt ? 'Please select a belt to continue.' : 'Please indicate that you have read the requirements above to continue.'}
                        </div>
                    }
                </>
            </Collapse>

            <Collapse in={!!form.form.requestBelt && !!form.form.readRequirements}>

                {form.form.requestBelt === 'Black Belt' &&
                    <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom:24}}>
                        REMINDER: Black Belt request videos receive the highest possible level of scrutiny
                        on every detail of the lock. Be sure to include clear evidence of all locking components,
                        pins, and milling in your video.
                    </div>
                }

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


                        {questFieldNames.map((questFieldName, idx) => (
                            <div key={idx} style={{margin: '12px 0 18px 0'}}>
                                <BeltRequestEpicQuest handleReplaceQuest={handleReplaceQuest}
                                                      fieldName={questFieldName}
                                                      form={form}
                                                      entryNumber={idx + 1}
                                                      formDefaults={formDefaults}/>
                            </div>
                        ))}


                        {form.form.requestBelt.includes('Dan') &&
                            <div style={{display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center'}}>
                                <div style={{flexGrow: 1, width: '100%'}}>
                                    <FormElement fieldType={'TextField'}
                                                 fieldName={'danRequestEvidence'}
                                                 label={'Link to Dan Evidence'}
                                                 fieldSettings={{
                                                     descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                                     inputWidth: '100%',
                                                     style: {width: '100%'}
                                                 }}
                                                 fullWidth
                                                 form={form}
                                                 formDefaults={formDefaults}
                                                 checkValid={checkValidUrl}
                                                 color={(form.form.danRequestEvidence && !checkValidUrl(form.form.danRequestEvidence)) ? 'error' : 'info'}
                                                 errorMessage={(form.form.danRequestEvidence && !checkValidUrl(form.form.danRequestEvidence)) ? 'A valid link is required' : undefined}
                                                 after={
                                                     <Button variant='contained' size='small' color='info'
                                                             style={{marginTop: 2}} onClick={fillProfileLink}>
                                                         Fill in profile link
                                                     </Button>
                                                 }
                                    />
                                </div>
                            </div>
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
                                             margin: '24px 0 18px'
                                         }}
                                         form={form}
                                         formDefaults={formDefaults}/>
                        }

                        {form.form.requestBelt === 'Black Belt' &&
                            <FormElement fieldType={'TextField'}
                                         fieldName={'blackBeltMentoringInfo'}
                                         label={'Describe your mentoring or similar community involvement (Required)'}
                                         multiline={true}
                                         rows={2}
                                         fieldSettings={{
                                             descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                             inputWidth: '100%',
                                             margin: '24px 0 18px'
                                         }}
                                         form={form}
                                         formDefaults={formDefaults}/>
                        }

                        <FormElement fieldType={'TextField'}
                                     fieldName={'notes'}
                                     description={'Any notes or other required information?'}
                                     multiline={true}
                                     rows={4}
                                     fieldSettings={{
                                         descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                         inputWidth: '100%',
                                         margin: 0
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}/>

                    </>
                }
            </Collapse>


            <FormElement fieldType={'SectionHeader'}
                         label={'Request Details'}
                         options={[4, sectionCount]}/>

            <Collapse in={!!form.form.requestBelt && !!form.form.readRequirements}>
                {!!form.form.requestBelt && !!form.form.readRequirements &&

                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <FormElement fieldType={'RadioGroup'}
                                     fieldName={'requestPlatform'}
                                     description={'What platform would you like to use?'}
                                     options={['Discord Post', 'Reddit Modmail']}
                                     fieldSettings={{
                                         descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                         style: {marginRight: 54},
                                         margin: '0 54px 0 0'
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}/>

                        <Collapse in={!!form.form.requestPlatform}>
                            {!!form.form.requestPlatform &&
                                <FormElement fieldType={'TextField'}
                                             fieldName={'sync'}
                                             description={`Enter your ${syncPlatform} username to request sync:`}
                                             fieldSettings={{
                                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                                 inputWidth: 300,
                                                 margin: 0
                                             }}
                                             form={form}
                                             formDefaults={formDefaults}/>
                            }
                        </Collapse>
                    </div>
                }
            </Collapse>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 16}}>
                <Button onClick={form.submit} variant='contained' color='info'
                        disabled={!form.canSave} style={{boxShadow: 'none'}}>
                    {form.updating
                        ? <LoadingDisplayWhiteSmall size={'small'}/>
                        : 'Copy Request'
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
                        }}>Request Copied to Clipboard
                        </Typography>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <Button onClick={form.clearSubmit} variant='contained' color='success'
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
