import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
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
import APIContext from '../../app/APIContext.jsx'
import {enqueueSnackbar} from 'notistack'
import {useLocation, useNavigate} from 'react-router-dom'
import {peekDiscordPostingGrant, startDiscordAuth, takeDiscordPostingGrant} from '../../auth/discordAuth.js'
import handleRequestSubmit from './handleRequestSubmit'
import isValidUrl from '../../util/isValidUrl'
import BeltRequestEpicQuest from './BeltRequestEpicQuest.jsx'
import {buildDiscordBeltRequest, clearDiscordBeltRequestDraft, readDiscordBeltRequestDraft,
    saveDiscordBeltRequestDraft} from './discordBeltRequest.js'

const beltRequestsChannelUrl = 'https://discord.com/channels/140129091796992000/282173282546089985'

/**
 * @prop requestBelt
 * @prop readRequirements
 * @prop requestPlatform
 * @prop danRequestEvidence
 */

export default function BeltRequestForm() {
    const {profile} = useContext(ScorecardDataContext)
    const {user} = useContext(AuthContext)
    const {startDiscordOAuth, postDiscordBeltRequest} = useContext(APIContext)
    const location = useLocation()
    const navigate = useNavigate()
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
    const [sending, setSending] = useState(false)
    const [delivery, setDelivery] = useState(null)
    const [draftRestored, setDraftRestored] = useState(false)
    const sendingRef = useRef(false)
    const restoredFor = useRef(null)
    const autoPostHandled = useRef(false)

    const processChange = useCallback((event) => {
        const {name, value} = event.target
        //const cleanValue = sanitizeValues(value, {profanityOK: false, urlsOK: true})
        let events = [event]

        if (name === 'requestBelt') {
            form.reload()
            setLockCount(beltRoles.indexOf(value) <= 4 ? 1 : 2)

            if (value.includes('Blue')) form.require(['blueBeltProjectInfo'])

            if (value.includes('Black')) {
                setQuestCount(2)
                setTimeout(() => {
                    form.require(['blackBeltMentoringInfo'])
                }, 100)
            } else setQuestCount(0)

            if (value.includes('Dan')) {
                events.push({target: {name: 'readRequirements', value: true}})
                setLockCount(0)
                setQuestCount(0)
                setTimeout(() => {
                    form.require(['danRequestEvidence'])
                }, 100)
            }
        }
        if (name === 'readRequirements') {
            entryFieldNames.forEach((fieldName) => {
                events.push({target: {name: fieldName, action: 'delete'}})
            })
            questFieldNames.forEach((fieldName) => {
                events.push({target: {name: fieldName, action: 'delete'}})
            })
        }
        return events
    }, [entryFieldNames, form, questFieldNames])

    const baseForm = useMemo(() => {
        return {}
    }, [])

    const processSubmit = useCallback((form) => {
        handleRequestSubmit(form)
        const newForm = {...form}
        // pre-process
        return newForm
    }, [])

    const handleSubmit = useCallback((_form) => {
        //    const {saveSurveySubmission} = useContext(DBContext)
    }, [])

    form = useForm({baseForm, processChange, processSubmit, handleSubmit})
    const restoreForm = form.restore

    useEffect(() => {
        if (!userId || restoredFor.current === userId) return
        restoredFor.current = userId
        const draft = readDiscordBeltRequestDraft(userId)
        if (!draft) return
        restoreForm(draft.form)
        setLockCount(draft.lockCount)
        setQuestCount(draft.questCount)
        setDraftRestored(true)
    }, [userId, restoreForm])

    useEffect(() => {
        if (!form.intialized) {
            form.initialize({
                requiredFields: ['requestBelt', 'readRequirements', 'requestPlatform'],
                clearOnSubmit: false
            })
        }
    }, [form])

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

    const hasPostingGrant = Boolean(userId && peekDiscordPostingGrant(userId))
    const postingStatus = sending
        ? 'Sending your request to Discord...'
        : delivery
            ? 'Your request was delivered to Discord.'
            : hasPostingGrant
                ? 'Discord is authorized. Your request is ready to send.'
                : draftRestored
                    ? 'Your draft was restored. Click Post to Discord to authorize again.'
                    : ''

    const sendDiscordRequest = useCallback(async (request) => {
        if (sendingRef.current) return
        const postingGrant = takeDiscordPostingGrant(userId)
        if (!postingGrant) {
            enqueueSnackbar('Discord authorization expired. Click Post to Discord to authorize again.',
                {variant: 'warning'})
            return
        }
        sendingRef.current = true
        setSending(true)
        try {
            const result = await postDiscordBeltRequest({postingGrant, request})
            clearDiscordBeltRequestDraft()
            setDelivery(result)
            setDraftRestored(false)
        } catch (error) {
            if (['discord_grant_invalid', 'discord_grant_expired', 'discord_grant_forbidden'].includes(error.code)) {
                enqueueSnackbar('Discord authorization expired or was used. Click Post to Discord to authorize again.',
                    {variant: 'warning'})
            } else if (error.code === 'discord_send_uncertain') {
                enqueueSnackbar('Delivery could not be confirmed. Check the Discord channel before trying again.',
                    {variant: 'warning'})
            } else if (error.code === 'discord_rate_limited') {
                enqueueSnackbar(`Discord is rate limiting requests. Wait ${error.retryAfter || 'a while'} seconds before trying again.`,
                    {variant: 'warning'})
            } else if (error.code === 'belt_request_posting_disabled') {
                enqueueSnackbar('Discord posting is disabled on the API server. Your draft is saved; try again after the test webhook is configured.',
                    {variant: 'warning'})
            } else {
                enqueueSnackbar(`Could not post to Discord: ${error.message}`, {variant: 'error'})
            }
        } finally {
            sendingRef.current = false
            setSending(false)
        }
    }, [userId, postDiscordBeltRequest])

    useEffect(() => {
        if (!location.state?.discordAutoPost || !userId || autoPostHandled.current) return
        autoPostHandled.current = true
        navigate(location.pathname, {replace: true, state: null})
        const draft = readDiscordBeltRequestDraft(userId)
        if (!draft || !peekDiscordPostingGrant(userId)) {
            enqueueSnackbar('Your Discord request could not be resumed. Review your draft and try again.',
                {variant: 'warning'})
            return
        }
        try {
            sendDiscordRequest(buildDiscordBeltRequest(draft.form))
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'})
        }
    }, [location.state, location.pathname, userId, navigate, sendDiscordRequest])

    const handleDiscordPost = useCallback(async () => {
        if (!userId) {
            enqueueSnackbar('Sign in to post a belt request to Discord.', {variant: 'warning'})
            return
        }
        if (!form.canSave || sendingRef.current) return
        let request
        try {
            request = buildDiscordBeltRequest(form.form)
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'})
            return
        }
        try {
            saveDiscordBeltRequestDraft({uid: userId, form: form.form, lockCount, questCount})
        } catch {
            enqueueSnackbar('Could not save your request draft for Discord authorization.', {variant: 'error'})
            return
        }
        if (!peekDiscordPostingGrant(userId)) {
            sendingRef.current = true
            setSending(true)
            try {
                await startDiscordAuth({startDiscordOAuth, purpose: 'beltRequest', returnTo: '/beltRequests'})
            } catch (error) {
                enqueueSnackbar(`Could not connect Discord: ${error.message}`, {variant: 'error'})
            } finally {
                sendingRef.current = false
                setSending(false)
            }
            return
        }
        await sendDiscordRequest(request)
    }, [userId, form.canSave, form.form, lockCount, questCount, startDiscordOAuth, sendDiscordRequest])

    return (

        <div style={{
            maxWidth: 800, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
        }}>

            <div style={{fontSize: '1.0rem', fontWeight: 400, margin: '32px 0 0'}}>
                This form makes it easy to compose your belt request to be clear and
                easy for moderators to review. Simply select the belt you&#39;re requesting
                and complete each of the steps that follow. <strong>Once you&#39;re done,
                click &#34;Copy Request&#34; to paste it yourself, or choose Discord Post and use
                &#34;Post to Discord&#34; to authorize and send it.</strong> Please
                note: incomplete requests &mdash; or those which do not meet the belt
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
                    <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 24}}>
                        REMINDER: Black Belt request videos receive the highest possible level of scrutiny
                        on every detail of the lock. Be sure to include clear evidence of all locking components,
                        including pins, milling, sidebars, etc. in your video.
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
                                         margin: '10px 54px 0 0'
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}/>

                        <Collapse in={!!form.form.requestPlatform}>
                            {!!form.form.requestPlatform &&
                                <FormElement fieldType={'TextField'}
                                             fieldName={'sync'}
                                             description={`If you'd like to be flagged on both platforms, enter your ${syncPlatform} username to sync:`}
                                             fieldSettings={{
                                                 descriptionStyle: {fontSize: '1.1rem', fontWeight: 500},
                                                 inputWidth: 300,
                                                 margin: '10px 0 0 0',
                                                 style: {width: 360}
                                             }}
                                             form={form}
                                             formDefaults={formDefaults}/>
                            }
                        </Collapse>
                    </div>
                }
            </Collapse>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 16}}>
                <Button onClick={form.submit} variant='contained' color='info'
                        disabled={!form.canSave || form.submitting || sending}
                        style={{boxShadow: 'none', margin: '0 10px'}}>
                    {form.submitting
                        ? <LoadingDisplayWhiteSmall size={'small'}/>
                        : 'Copy Request'
                    }
                </Button>
                <Button onClick={handleDiscordPost} variant='contained' color='info'
                        aria-label='Post to Discord'
                        disabled={!form.canSave || form.submitting || sending ||
                            form.form.requestPlatform !== 'Discord Post'}
                        style={{boxShadow: 'none', margin: '0 10px'}}>
                    {sending
                        ? <LoadingDisplayWhiteSmall size={'small'}/>
                        : 'Post to Discord'
                    }
                </Button>
            </div>

            {form.form.requestPlatform === 'Discord Post' &&
                <Typography sx={{textAlign: 'center', marginBottom: 2}}>
                    {postingStatus}
                </Typography>
            }
            {location.state?.discordAuthError &&
                <Typography color='error' sx={{textAlign: 'center', marginBottom: 2}}>
                    {location.state.discordAuthError}
                </Typography>
            }


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
                            <Button href={beltRequestsChannelUrl} target='_blank' rel='noopener noreferrer'
                                    variant='outlined' color='info' sx={{marginRight: 2}}>
                                Open #belt-requests
                            </Button>
                            <Button onClick={form.clearSubmit} variant='contained' color='success'
                                    style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                OK
                            </Button>
                        </div>
                    </Paper>
                </div>
            </Dialog>

            <Dialog open={Boolean(delivery)} onClose={() => setDelivery(null)} slotProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.8}}
            }}>
                <Paper sx={{padding: '40px', textAlign: 'center'}}>
                    <Typography sx={{fontSize: '1.5rem', fontWeight: 500, marginBottom: 2}}>
                        Request sent to Discord
                    </Typography>
                    <Typography sx={{marginBottom: 4}}>
                        LockyJr is processing it now!
                    </Typography>

                    <Button href={beltRequestsChannelUrl} target='_blank' rel='noopener noreferrer'
                            variant='outlined' color='info' sx={{marginRight: 2}}>
                        Open #belt-requests
                    </Button>
                    <Button onClick={() => setDelivery(null)} variant='outlined' color='success'>Thanks</Button>
                </Paper>
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
