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

const statuses = ['Draft', 'Pending', 'Staged', 'Published', 'Re-opened', 'Settled']
const actions = ['Belt Change', 'Sameline', 'Delete']

export default function EntryClassificationAdmin({entry, handleToggle}) {
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
        return () => { active = false }
    }, [entry.id, summaryAction?.id, needsFetch, fetchClassificationAction])

    if (actionError) return <div role='alert'>Could not load the current classification action.</div>
    if (actionLoading) {
        return <div role='status'>Loading classification action…</div>
    }
    const action = loadedAction ?? summaryAction
    return <EntryClassificationAdminForm key={action?.id ?? 'new'} entry={entry}
                                         handleToggle={handleToggle} action={action}/>
}

function EntryClassificationAdminForm({entry, handleToggle, action}) {
    const {accessInfo} = useAccess()
    const {allEntries} = useContext(DataContext)

    const adminAction = useMemo(() => {
        if (!action || action.status === 'Published') return {status: 'Pending'}
        const target = action.samelineTargetId && allEntries.find(entry => entry.id === action.samelineTargetId)
        return target ? {...action, samelineLock: {
            lockId: target.id, belt: target.belt, lockFullName: action.samelineTargetName
        }} : action
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
        return events
    }, [])
    const handleCancel = useCallback(() => {
        form.reload()
        handleToggle && handleToggle()
    }, [form, handleToggle])

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

    const {isMobile} = useWindowSize()
    const padding = !isMobile ? '0 20px 0 8px' : '0 0px 0 0'
    const rows = !isMobile ? 4 : 6
    const buttonText = adminAction.id
        ? 'Save Changes'
        : 'Save'
    const noteColor = form.form.omitChangelog ? '#999' : '#fff'

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
                                <FormElement fieldType={'SelectBox'} fieldName={'action'}
                                             options={actions}
                                             fieldSettings={{
                                                 inputWidth: !isMobile ? 170 : 160,
                                                 inputSize: 'small'
                                             }}
                                             form={form} formDefaults={formDefaults}/>
                            </div>
                            {form.form?.action === 'Belt Change' &&
                                <div>
                                    <div style={{fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px'}}>
                                        New Belt
                                    </div>
                                    <FormElement fieldType={'SelectBox'} fieldName={'updatedBelt'}
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
                                    <FormElement fieldType={'LockEntrySearchBox'} fieldName={'samelineLock'}
                                                 options={allEntries}
                                                 fieldSettings={{
                                                     margin: '6px 0px 0px 0px',
                                                     style: {width: !isMobile ? 400 : 270},
                                                     inputWidth: !isMobile ? 400 : 270,
                                                     inputSize: 'small',
                                                     lock: form.form.samelineLock
                                                 }}
                                                 form={form} formDefaults={formDefaults}/>
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
                    <div style={{
                        display: 'flex',
                        flexGrow: 1,
                        justifyContent: 'right',
                        alignItems: 'flex-start',
                        marginTop: 16,
                        gap: 10
                    }}>
                        {adminAction.id &&
                            <Button variant='text' size='small' style={{color: '#e12121'}} disabled>Delete</Button>
                        }
                        <div style={{flexGrow: 1}}/>
                        <div style={{
                            display: 'flex',
                            flexDirection: !isMobile ? 'row' : 'column',
                            justifyContent: 'right',
                            gap: 16
                        }}>
                            <Button variant='text' size='small' style={{color: '#aaa'}}
                                    onClick={handleCancel}>Cancel</Button>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: !isMobile ? 'row' : 'column',
                            justifyContent: 'right',
                            gap: 16
                        }}>
                            <Button variant='text' size='small' disabled
                                    color='success' style={{whiteSpace: 'nowrap'}}>{buttonText}</Button>
                            <Button variant='text' size='small' disabled
                                    color='success' style={{whiteSpace: 'nowrap'}}>Publish Now</Button>
                        </div>
                    </div>
                    <div role='status' style={{color: '#aaa', fontSize: '0.85rem', textAlign: 'right'}}>
                        Preview only — admin changes are unavailable.
                    </div>

                </div>
            </div>
            <div style={{marginTop: 24}}/>

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
