import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {useAccess} from '../app/AccessContext.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'
import DisplayClassificationVotes from './DisplayClassificationVotes.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import useForm from '../formUtils/useForm.jsx'
import FormElement from '../formUtils/FormElement.jsx'
import {danBelts} from '../data/belts.js'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'
import Button from '@mui/material/Button'
import {Collapse} from '@mui/material'
import EntryClassificationVote from './EntryClassificationVote.jsx'
import ChangelogPreviewButton from './ChangelogPreviewButton.jsx'
import DataContext from '../context/DataContext.jsx'
import APIContext from '../app/APIContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import useClassificationCommand from './useClassificationCommand.js'
import {canWriteActions, canPublishClassification} from './writeStage.js'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import DeleteButton from '../misc/DeleteButton.jsx'
import LogEntryButton from '../entries/LogEntryButton.jsx'
import {enqueueSnackbar} from 'notistack'
import scrollRefToTop from '../util/scrollRefToTop.js'
import ConfirmButton from '../misc/ConfirmButton.jsx'

const statuses = ['Draft', 'Pending', 'Staged', 'Re-opened', 'Settled']
const actions = ['Belt Change', 'Sameline', 'Delete']

export default function EntryClassificationAdmin({entry, handleToggle, entryRef}) {
    const {getAdminAction} = useContext(ClassificationContext)
    const {fetchClassificationAction} = useContext(APIContext)
    const {userClaims = []} = useContext(AuthContext)
    const summaryAction = getAdminAction(entry)
    const needsFetch = summaryAction?.action === undefined &&
        userClaims.some(claim => ['admin', 'classificationAdmin'].includes(claim))
    const [loadedAction, setLoadedAction] = useState(null)
    const [actionLoading, setActionLoading] = useState(needsFetch)
    const [actionError, setActionError] = useState(null)

    useEffect(() => {
        if (!needsFetch) return
        let active = true
        setLoadedAction(null)
        setActionLoading(true)
        setActionError(null)
        fetchClassificationAction(entry.id).then(action => {
            if (active) {
                if (summaryAction?.id && !action) {
                    setActionError(new Error('Current action changed'))
                } else {
                    setLoadedAction(action)
                }
                setActionLoading(false)
            }
        }).catch(error => {
            if (active) {
                setActionError(error)
                setActionLoading(false)
            }
        })
        return () => {
            active = false
        }
    }, [entry.id, summaryAction?.id, needsFetch, fetchClassificationAction])

    if (actionError) return <div role='alert'>Could not load the current classification action.</div>
    if (actionLoading) {
        return <div role='status' aria-label='Loading classification action'
                    style={{width: '100%', textAlign: 'center', marginTop: 8}}>
            <LoadingDisplay size={22} thickness={5} style={{marginTop: 8}}/>
        </div>
    }
    const action = loadedAction ?? summaryAction
    return <EntryClassificationAdminForm key={action?.id ?? 'new'} entry={entry} entryRef={entryRef}
                                         handleToggle={handleToggle} action={action}
                                         onActionChange={setLoadedAction}/>
}

function EntryClassificationAdminForm({entry, handleToggle, action, onActionChange, entryRef}) {
    const {accessInfo} = useAccess()
    const {allEntries} = useContext(DataContext)
    const {run, pending, error} = useClassificationCommand()
    const {isMobile} = useWindowSize()

    const adminAction = useMemo(() => {
        if (!action || action.status === 'Published') return {status: 'Draft'}
        const target = action.samelineTargetId && allEntries.find(entry => entry.id === action.samelineTargetId)
        return target ? {
            ...action, samelineLock: {
                lockId: target.id, belt: target.belt, lockFullName: action.samelineTargetName
            }
        } : action
    }, [action, allEntries])

    let form
    const baseForm = adminAction

    const processChange = useCallback((event) => {
        const {name, value} = event.target
        //const cleanValue = sanitizeValues(value, {profanityOK: false, urlsOK: true})
        let events = [event]

        const changelogFields = ['updatedBelt', 'samelineLock']
        if ((name === 'status' && ['Settled', 'Re-opened'].includes(value)) || name === 'action') {
            changelogFields.forEach((fieldName) => {
                events.push({target: {name: fieldName, action: 'delete'}})
            })
        }
        if (name === 'status' && ['Settled', 'Re-opened'].includes(value)) {
            events.push({target: {name: 'action', action: 'delete'}})
        }
        return events
    }, [])
    const handleCancel = useCallback(() => {
        form.reload()
        handleToggle && handleToggle()
        scrollRefToTop(entryRef)
    }, [entryRef, form, handleToggle])

    form = useForm({baseForm, processChange})

    useEffect(() => {
        if (!form.intialized) {
            form.initialize({
                requiredFields: [],
                clearOnSubmit: false
            })
        }
    }, [form])

    const currentAction = useMemo(() => {
        return {...adminAction, ...form.form}
    }, [adminAction, form.form])

    const previousVotes = entry.previousVotes ?? []
    const showVotes = true
    const [showPreviousVotes, setShowPreviousVotes] = useState(!entry.currentVotes?.length)

    const padding = !isMobile ? '0 20px 0 8px' : '0 0px 0 0'
    const rows = !isMobile ? 4 : 6
    const buttonText = adminAction.id
        ? 'Save Changes'
        : 'Save'
    const noteColor = form.form.omitChangelog ? '#999' : '#fff'

    const actionFields = () => ({
        status: form.form.status,
        action: form.form.action || null,
        updatedBelt: form.form.action === 'Belt Change' ? form.form.updatedBelt || null : null,
        samelineTargetId: form.form.action === 'Sameline'
            ? form.form.samelineLock?.lockId ?? form.form.samelineTargetId ?? null : null,
        note: form.form.note || null,
        adminNote: form.form.adminNote || null,
        omitChangelog: Boolean(form.form.omitChangelog)
    })

    const validDecision = fields => !['Staged'].includes(fields.status) || Boolean(fields.action)
    const validTarget = fields => (fields.action !== 'Belt Change' || Boolean(fields.updatedBelt))
        && (fields.action !== 'Sameline' || Boolean(fields.samelineTargetId))

    const handleSave = async () => {
        const fields = actionFields()
        try {
            const result = adminAction.id
                ? await run('patch', `actions/${encodeURIComponent(adminAction.id)}`, {
                    ...fields, expectedRevision: adminAction.revision
                })
                : await run('post', 'actions', {entryId: entry.id, ...fields})
            onActionChange(result.action)
            enqueueSnackbar('Changes saved.')
            scrollRefToTop(entryRef)
            handleToggle?.()
        } catch {
            // Keep current fields for correction or retry.
        }
    }

    const handleDelete = async () => {
        try {
            await run('delete', `actions/${encodeURIComponent(adminAction.id)}`, {
                expectedRevision: adminAction.revision
            })
            onActionChange(null)
            handleToggle?.()
        } catch {
            // Show the API error.
        }
    }

    const handlePublish = async () => {
        const fields = actionFields()
        try {
            await run('post', 'publications/single', {
                entryId: entry.id,
                actionId: adminAction.id ?? null,
                expectedRevision: adminAction.id ? adminAction.revision : null,
                action: fields.action,
                updatedBelt: fields.updatedBelt,
                samelineTargetId: fields.samelineTargetId,
                note: fields.note,
                adminNote: fields.adminNote,
                omitChangelog: false
            })
            enqueueSnackbar('Changes published.', {variant: 'success'})
            handleToggle?.()
        } catch {
            // Keep current fields and retry key for an uncertain response.
        }
    }
    if (!accessInfo.roles.classificationAdmin) return null

    return (
        <div style={{borderTop: '1px solid #444', padding}}>
            {showVotes &&
                <>
                    {entry.currentVotes?.length > 0 &&
                        <div style={{
                            display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
                            fontSize: '0.9rem', lineHeight: '1.8rem'
                        }}>
                            current votes<br/>
                            <DisplayClassificationVotes votes={entry.currentVotes} context={'admin'}/>
                        </div>
                    }
                    {previousVotes.length > 0 &&
                        <div style={{
                            display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
                            fontSize: '0.8rem', lineHeight: '1.8rem', marginTop: 2
                        }}>
                            <Link
                                onClick={() => setShowPreviousVotes(!showPreviousVotes)}>{showPreviousVotes ? 'hide' : 'show'} previous
                                votes</Link>
                            {showPreviousVotes && <DisplayClassificationVotes votes={previousVotes}/>}
                        </div>
                    }
                </>
            }
            <div style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                margin: '16px 0px 0px 0px'
            }}>
                <BeltStripeMini value={form.form.updatedBelt || form.form.samelineLock?.belt} width={!isMobile ? 6 : 3}
                                offset={26}
                                style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>
                <div style={{marginLeft: !isMobile ? 16 : 10, width: '100%'}}>
                    <div style={{fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px'}}>
                        Set Status
                    </div>
                    <FormElement fieldType={'SelectBox'} fieldName={'status'} options={statuses}
                                 fieldSettings={{
                                     inputWidth: 140,
                                     inputSize: 'small'
                                 }}
                                 form={form} formDefaults={formDefaults}/>
                    <Collapse in={!['Settled', 'Re-opened'].includes(form.form.status)}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 16,
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <div style={{fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px'}}>
                                    Action
                                </div>
                                <FormElement fieldType={'SelectBox'}
                                             fieldName={'action'}
                                             options={actions}
                                             fieldSettings={{
                                                 inputWidth: !isMobile ? 170 : 160,
                                                 inputSize: 'small'
                                             }}
                                             form={form}
                                             formDefaults={formDefaults}/>
                            </div>
                            {form.form?.action === 'Belt Change' &&
                                <div>
                                    <div style={{fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px'}}>
                                        New Belt
                                    </div>
                                    <FormElement fieldType={'SelectBox'}
                                                 fieldName={'updatedBelt'}
                                                 options={danBelts.slice(0, 13)}
                                                 fieldSettings={{
                                                     inputWidth: !isMobile ? 140 : 100,
                                                     inputSize: 'small'
                                                 }}
                                                 form={form} formDefaults={formDefaults}/>
                                </div>
                            }
                            {form.form?.action === 'Sameline' &&
                                <div>
                                    <div style={{fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px'}}>
                                        Sameline With
                                    </div>
                                    <FormElement fieldType={'LockEntrySearchBox'}
                                                 fieldName={'samelineLock'}
                                                 options={allEntries}
                                                 fieldSettings={{
                                                     margin: '6px 0px 0px 0px',
                                                     style: {width: !isMobile ? 400 : 270},
                                                     inputWidth: !isMobile ? 400 : 270,
                                                     inputSize: 'small',
                                                     lock: form.form.samelineLock
                                                 }}
                                                 form={form}
                                                 formDefaults={formDefaults}/>
                                </div>
                            }
                        </div>

                        <FormElement fieldType={'SingleCheckbox'}
                                     fieldName={'omitChangelog'}
                                     description={''}
                                     options={['Omit from changelog.']}
                                     fieldSettings={{
                                         descriptionStyle: {fontSize: '1.0rem', fontWeight: 600},
                                         inputWidth: 20,
                                         color: 'success',
                                         fontWeight: 700,
                                         style: {marginBottom: 16}
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}/>

                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px', color: noteColor
                        }}>
                            Changelog Note
                        </div>
                        <FormElement fieldType={'TextField'} fieldName={'note'}
                                     fieldSettings={{
                                         placeholder: 'Comments are optional, but highly recommended.',
                                         margin: '0 0 16px 0',
                                         inputWidth: '100%',
                                         style: {width: '100%'},
                                         slotProps: {
                                             htmlInput: {
                                                 style: {
                                                     fontSize: '0.9rem', color: noteColor
                                                 }
                                             }
                                         }
                                     }}
                                     rows={rows}
                                     fullWidth
                                     color={'info'}
                                     form={form} formDefaults={formDefaults}
                        />

                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px', color: noteColor
                        }}>
                            Admin Notes
                        </div>
                        <FormElement fieldType={'TextField'} fieldName={'adminNote'}
                                     fieldSettings={{
                                         placeholder: 'Internal notes. Will not be included in changelog',
                                         margin: '0 0 16px 0',
                                         inputWidth: '100%',
                                         style: {width: '100%'},
                                         slotProps: {
                                             htmlInput: {
                                                 style: {
                                                     fontSize: '0.9rem', color: noteColor
                                                 }
                                             }
                                         }
                                     }}
                                     rows={rows}
                                     fullWidth
                                     color={'info'}
                                     form={form} formDefaults={formDefaults}
                        />
                    </Collapse>

                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <ChangelogPreviewButton entry={entry} currentAction={currentAction}/>
                    </div>

                    {pending && <div role='status' style={{width: '100%', textAlign: 'center', marginTop: 8}}>
                        <LoadingDisplay size={22} thickness={5} style={{marginTop: 8}}/>
                    </div>}

                    <div style={{
                        display: 'flex',
                        flexGrow: 1,
                        justifyContent: 'right',
                        alignItems: 'flex-start',
                        marginTop: 16,
                        gap: 10
                    }}>
                        {adminAction.id &&
                            <DeleteButton variant='text' size='small' color='error'
                                          disabled={pending || !canWriteActions}
                                          onClick={handleDelete}>Delete</DeleteButton>
                        }
                        <div style={{flexGrow: 1}}/>
                        <div style={{
                            display: 'flex',
                            flexDirection: !isMobile ? 'row' : 'column',
                            justifyContent: 'right',
                            gap: 16
                        }}>
                            <Button variant='text' size='small' style={{color: '#aaa'}}
                                    onClick={handleCancel} disabled={pending}>Cancel</Button>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: !isMobile ? 'row' : 'column',
                            justifyContent: 'right',
                            gap: 16
                        }}>
                            <Button variant='text' size='small' onClick={handleSave}
                                    disabled={pending || !canWriteActions || !form.changed || !validDecision(actionFields()) ||
                                        !validTarget(actionFields())}
                                    color='success' style={{whiteSpace: 'nowrap'}}>{buttonText}</Button>
                            <ConfirmButton variant='text' size='small' color='success'
                                           message={'About to publish this change'}
                                           disabled={pending || !canPublishClassification || !actionFields().action || !validTarget(actionFields()) ||
                                               Boolean(actionFields().omitChangelog)}
                                           style={{height: 32, marginLeft: 16}}
                                           onClick={handlePublish}>
                                Publish Now
                            </ConfirmButton>
                        </div>
                    </div>
                    {!canWriteActions && <div role='status'>Classification action writes are not enabled yet.</div>}
                    {error && <div role='alert'>Could not save: {error.message}
                        {error.status === 409 && ' Reload this lock before trying again.'}</div>}

                </div>
            </div>
            <div style={{margin: '12px 0', textAlign: 'center'}}>
                <LogEntryButton entry={adminAction}/>
            </div>

            <EntryClassificationVote entry={entry}/>

        </div>
    )
}

const formDefaults = {
    margin: '0px 0px 16px 0px',
    labelStyle: {fontSize: '1.0rem', fontWeight: 600},
    descriptionStyle: {fontSize: '1.0rem', fontWeight: 400},
    sectionHeaderStyle: {},
    sectionHeaderInfoStyle: {},
    inputWidth: 80,
    inputSize: 'small',
    color: 'info'
}
