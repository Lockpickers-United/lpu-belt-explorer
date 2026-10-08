import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useAccess} from '../app/AccessContext.jsx'
import classificationAdminActions from '../data/classification-samples-admin.json'
import DisplayClassificationVotes from './DisplayClassificationVotes.jsx'
import dayjs from 'dayjs'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import useForm from '../formUtils/useForm.jsx'
import FormElement from '../formUtils/FormElement.jsx'
import {danBelts} from '../data/belts.js'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'
import Button from '@mui/material/Button'
import {Collapse} from '@mui/material'
import EntryClassificationVote from './EntryClassificationVote.jsx'

const statuses = ['Pending', 'Staged', 'Published', 'Re-opened', 'Settled']
const actions = ['Belt Change', 'Sameline', 'Delete']

export default function EntryClassificationAdmin({entry, handleToggle}) {
    const {accessInfo} = useAccess()
    if (!accessInfo.roles.classificationAdmin) return null

    return <AdminPreview entry={entry} handleToggle={handleToggle}/>
}

function AdminPreview({entry, handleToggle}) {
    const entryClassificationAdminActions = useMemo(() => classificationAdminActions && classificationAdminActions
            .filter(a => a.entryId === entry.id)
            .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf())
        || [], [entry.id])

    const adminAction = useMemo(() =>
        entryClassificationAdminActions && entryClassificationAdminActions
            .find(a => a.entryId === entry.id) || {status: ''}, [entryClassificationAdminActions, entry.id])

    let form
    const baseForm = useMemo(() => adminAction ?? {}, [adminAction])

    const processChange = useCallback((event) => {
        const {name, value} = event.target
        //const cleanValue = sanitizeValues(value, {profanityOK: false, urlsOK: true})
        let events = [event]

        const changelogFields = ['updatedBelt']
        if (name === 'status' && ['Settled', 'Re-opened'].includes(value)) {
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


    const showVotes = true
    const [showPreviousVotes, setShowPreviousVotes] = useState(!entry.currentVotes?.length)

    const {isMobile} = useWindowSize()
    const padding = !isMobile ? '0 20px 0 8px' : '0 6px 0 0px'
    const rows = !isMobile ? 4 : 6
    const buttonText = adminAction.id
        ? 'Save Changes'
        : 'Save'
    const noteColor = form.form.omitChangelog ? '#999' : '#fff'

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
                    {entry.previousVotes?.length > 0 &&
                        <div style={{
                            display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
                            fontSize: '0.8rem', lineHeight: '1.8rem', marginTop: 2
                        }}>
                            <Link
                                onClick={() => setShowPreviousVotes(!showPreviousVotes)}>{showPreviousVotes ? 'hide' : 'show'} previous
                                votes</Link>
                            {showPreviousVotes && <DisplayClassificationVotes votes={entry.previousVotes}/>}
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
                <BeltStripeMini value={form.form.updatedBelt} width={!isMobile ? 6 : 3} offset={26}
                                style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>
                <div style={{marginLeft: !isMobile ? 16 : 8, width: '100%'}}>
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
                        <div style={{display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center'}}>
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
                            <div>
                                <div style={{fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px'}}>
                                    New Belt
                                </div>
                                <FormElement fieldType={'SelectBox'} fieldName={'updatedBelt'}
                                             options={danBelts.slice(0, 13)}
                                             fieldSettings={{
                                                 inputWidth: !isMobile ? 140 : 120,
                                                 inputSize: 'small'
                                             }}
                                             form={form} formDefaults={formDefaults}/>
                            </div>
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
                    </Collapse>

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
                        <Button variant='text' size='small' style={{color: '#aaa'}}
                                onClick={handleCancel}>Cancel</Button>
                        <div style={{
                            display: 'flex',
                            flexDirection: !isMobile ? 'row' : 'column',
                            justifyContent: 'right',
                            gap: 16
                        }}>
                            <Button variant='text' size='small' disabled
                                    color='success' style={{whiteSpace: 'nowrap'}}>{buttonText}</Button>
                            <Button variant='text' size='small' disabled
                                    color='success' style={{whiteSpace: 'nowrap'}}>Save And Stage</Button>
                        </div>
                    </div>
                    <div role='status' style={{color: '#aaa', fontSize: '0.85rem', textAlign: 'right'}}>
                        Preview only — admin changes are unavailable.
                    </div>

                </div>
            </div>

            <EntryClassificationVote entry={entry} showCurrentVotes={false}/>

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
