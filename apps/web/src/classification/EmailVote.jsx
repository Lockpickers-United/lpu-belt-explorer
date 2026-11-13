import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import useWindowSize from '../util/useWindowSize.jsx'
import Dialog from '@mui/material/Dialog'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Tracker from '../app/Tracker.jsx'
import DataContext from '../locks/LockDataProvider.jsx'
import {postData, cleanError} from '../formUtils/postData.jsx'
import {nodeServerUrl} from '../data/dataUrls'
import useForm from '../formUtils/useForm.jsx'
import FormElement from '../formUtils/FormElement.jsx'
import {danBelts} from '../data/belts.js'
import {enqueueSnackbar} from 'notistack'
import ChoiceButtonGroup from '../util/ChoiceButtonGroup.jsx'
import TextField from '@mui/material/TextField'
import DisplayDialog from '../misc/DisplayDialog.jsx'
import {useNavigate} from 'react-router-dom'

export default function EmailVote() {
    const navigate = useNavigate()
    const {allEntries} = useContext(DataContext)
    const usernames = ['mg', 'yagias']
    const [username, setUsername] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    const [unrankedOnly, setUnrankedOnly] = useState(true)
    const filteredEntries = unrankedOnly
        ? allEntries.filter(entry => entry.belt === 'Unranked')
        : allEntries

    let form
    const baseForm = useMemo(() => {
        return {}
    }, [])
    form = useForm({baseForm})
    useEffect(() => {
        if (!form.intialized) {
            form.initialize({
                requiredFields: ['username', 'lock', 'votedBelt'],
                clearOnSubmit: true
            })
        }
    }, [form])

    const [uploading, setUploading] = useState(false)
    const handleSave = async () => {
        setUploading(true)
        const vote = {...form.form}
        const url = `${nodeServerUrl}/email-form`
        const formData = new FormData()
        formData.append('subjectText', `Vote submitted for ${form.form.lock.lockFullName} by ${form.form.username || 'unknown'}`)
        formData.append('username', vote.username)
        formData.append('lock', vote.lock?.lockFullName)
        formData.append('lockId', vote.lock?.lockId)
        formData.append('currentBelt', vote.lock?.belt)
        formData.append('votedBelt', vote.votedBelt)
        formData.append('comment', vote.comment)

        try {
            setResponse(await postData({url, formData}))
            enqueueSnackbar('Vote submitted.')
        } catch (error) {
            setUploadError(cleanError(error))
        } finally {
            setUploading(false)
        }
    }

    const [response, setResponse] = useState(undefined)
    const [uploadError, setUploadError] = useState(undefined)
    const handleChange = useCallback((event) => {
        setUsername(event.target.value)
    }, [])
    const handleLogin = () => {
        if (usernames.includes(username.toLowerCase())) {
            setLoggedIn(true)
            form.update({target: {name: 'username', value: username}})
        } else {
            navigate('/locks')
        }
    }

    const handleClose = () => {
        form.reload()
        setUploadError(undefined)
        setResponse(undefined)
        setUploading(false)
    }

    const toggleOptions = useMemo(() => {
        return [
            {label: 'Unranked', value: false},
            {label: 'All Locks', value: true},
        ]
    }, [])

    const {isMobile} = useWindowSize()
    const rows = !isMobile ? 5 : 8

    return (
        <>
            <DisplayDialog
                dialogContent={
                    <>
                        <div style={{padding: '24px 2px 24px', textAlign: 'center'}}>
                            <div style={{fontSize: '1.2rem', fontWeight: 600, marginBottom: 4}}>
                                Who's there?
                            </div>
                            <TextField type='text'
                                       name='field'
                                       value={username}
                                       onChange={handleChange}
                                       id='field'
                                       color='info'
                                       style={{}}
                                       placeholder='Enter authorized id'
                                       variant='outlined'
                                       autoFocus
                                       slotProps={{
                                           htmlInput: {style: {width: 280, fontSize: '1.0rem', textAlign: 'center'}}
                                       }}
                            />
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <Button onClick={handleLogin} variant='contained' size='small'
                                    style={{marginBottom: 32, marginRight: 16, backgroundColor: '#999', color: '#222'}}>
                                Cancel
                            </Button>
                            <Button style={{marginBottom: 32, color: '#222'}}
                                    variant='contained'
                                    disabled={username.length === 0}
                                    onClick={handleLogin}
                                    size='small'
                                    color='info'
                            >Submit</Button>
                        </div>
                    </>
                }
                open={!loggedIn}
                black={true}
                width={350}/>

            <div style={{
                maxWidth: 500, padding: 0,
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
            }}>
                <div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: !isMobile ? 400 : 350,
                        justifyContent: 'space-between',
                        marginBottom: 10
                    }}>
                        <div style={{fontSize: '1.4rem', fontWeight: 500}}>Select Lock</div>
                        <ChoiceButtonGroup
                            options={toggleOptions}
                            defaultValue={'Unranked'}
                            onChange={() => setUnrankedOnly(!unrankedOnly)}
                            small={true}
                            rounded
                            style={{height: 28}}
                        />
                    </div>
                    <FormElement fieldType={'LockEntrySearchBox'}
                                 fieldName={'lock'}
                                 options={filteredEntries}
                                 fieldSettings={{
                                     margin: '6px 0px 0px 0px',
                                     style: {width: !isMobile ? 400 : 350},
                                     inputWidth: !isMobile ? 400 : 350,
                                     inputSize: 'small',
                                     lock: form?.form?.lock
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}/>

                    <div>
                        <div style={{fontSize: '1.3rem', fontWeight: 500, margin: '30px 0px 4px'}}>Suggested Belt</div>
                        <FormElement fieldType={'SelectBox'}
                                     fieldName={'votedBelt'}
                                     options={danBelts.slice(0, 13)}
                                     fieldSettings={{
                                         inputWidth: 180,
                                         inputSize: 'small'
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}/>
                    </div>

                    <div style={{fontSize: '1.3rem', fontWeight: 500, margin: '30px 0px 4px'}}>Vote From</div>
                    <FormElement fieldType={'TextField'}
                                 fieldName={'username'}
                                 fieldSettings={{
                                     margin: '0 0 24px 0',
                                     inputWidth: !isMobile ? 400 : 350,
                                     style: {width: !isMobile ? 400 : 350},
                                     slotProps: {htmlInput: {style: {fontSize: '0.9rem'}}}
                                 }}
                                 form={form}
                                 formDefaults={formDefaults}
                                 color={'info'}
                    />

                    <div style={{fontSize: '1.3rem', fontWeight: 500, margin: '30px 0px 4px'}}>Comments</div>
                    <FormElement fieldType={'TextField'}
                                 fieldName={'comment'}
                                 fieldSettings={{
                                     placeholder: 'Comments are optional, but highly recommended.',
                                     margin: '0 0 24px 0',
                                     inputWidth: !isMobile ? 400 : 350,
                                     style: {width: !isMobile ? 400 : 350},
                                     slotProps: {htmlInput: {style: {fontSize: '0.9rem'}}}
                                 }}
                                 rows={rows}
                                 form={form}
                                 formDefaults={formDefaults}
                                 color={'info'}
                    />

                    <Button variant='contained'
                            size='small'
                            onClick={handleSave}
                            disabled={!form.canSave}
                            color='success' style={{whiteSpace: 'nowrap'}}>Submit</Button>

                </div>

                <Dialog open={uploading} slotProps={{
                    backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
                }}>
                    <div style={{width: 320, textAlign: 'center', padding: 30}}>
                        <LoadingDisplay/>
                    </div>
                </Dialog>

                <Dialog open={!!response && !uploadError} slotProps={{
                    backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
                }}>
                    <div style={{display: 'flex'}}>
                        <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                            <div style={{
                                fontSize: '1.7rem',
                                fontWeight: 500,
                                marginBottom: 60,
                                textAlign: 'center'
                            }}>Vote Submitted.
                            </div>
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <Button onClick={handleClose} variant='contained' color='info'
                                        style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                    OK
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog open={!!uploadError} slotProps={{
                    backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
                }}>
                    <div style={{display: 'flex'}}>
                        <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                            <div style={{fontSize: '1.7rem', fontWeight: 500, marginBottom: 20, textAlign: 'center'}}>
                                Something went wrong.<br/>
                                Please try again later.<br/>
                            </div>
                            <div style={{fontSize: '0.95rem', fontWeight: 400, marginBottom: 20, textAlign: 'center'}}>
                                {uploadError?.message}<br/>
                                (Error code {uploadError?.status})
                            </div>
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <Button onClick={handleClose} variant='contained' color='error'
                                        style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                    OK
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
                <Tracker feature='classificationEmailForm'/>
            </div>
        </>
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
