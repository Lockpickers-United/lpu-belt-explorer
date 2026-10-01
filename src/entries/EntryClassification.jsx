import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import {useAccess} from '../app/AccessContext.jsx'
import {sampleData} from '../classification/classificationData'
import {danBelts} from '../data/belts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Button from '@mui/material/Button'
import {Collapse} from '@mui/material'
import useForm from '../formUtils/useForm.jsx'
import FormElement from '../formUtils/FormElement.jsx'
import isValidUrl from '../util/isValidUrl'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'
import ClassificationVotes from '../classification/ClassificationVotes.jsx'

// https://api-dev.lpubelts.com/api/v1/locks/3ac43ea8/videos

export default function EntryClassification({entry}) {
    const {user} = useContext(AuthContext)
    const {accessInfo} = useAccess()

    const classificationVotes = useMemo(() => sampleData.filter(vote => vote.entryId === entry.id) || [], [entry.id])
    const userVote = useMemo(() => classificationVotes.find(vote => vote.userId === user.uid) || {}, [classificationVotes, user.uid])
    const showVotes = (classificationVotes?.length - (userVote?.id ? 1 : 0)) > 1

    const [active, setActive] = useState(userVote ? {userVote: true} : {})
    const handleActive = (type) => {
        setActive({[type]: true})
    }

    let form
    const baseForm = useMemo(() => userVote, [userVote])

    const handleCancel = useCallback(() => {
        form.reload()
        setActive({})
    }, [form])

    const processChange = null

    const processSubmit = useCallback((form) => {
        console.log('processSubmit called')
        //handleRequestSubmit(form)
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
                requiredFields: ['votedBelt'],
                clearOnSubmit: false
            })
        }
    }, [form])

    const fillScorecardLink = useCallback(() => {
    }, [])

    const checkValidUrl = useCallback(value => {
        return isValidUrl(value)
    }, [])

    if (accessInfo.enabledLevel < 50) return null

    return (
        <div style={{borderTop: '1px solid #444', padding: '0 20px 0 8px'}}>
            {showVotes &&
                <div style={{
                    display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
                    fontSize: '0.9rem', lineHeight: '1.8rem'
                }}>
                    current votes<br/>
                    <ClassificationVotes votes={classificationVotes}/>
                </div>
            }

            <Collapse in={userVote.id && !active.voteForm}>
                <div style={{fontSize: '0.9rem',
                    width: '100%',
                    position: 'relative',
                    margin: '16px 16px 0px 0px'
                }}>
                    <BeltStripeMini value={userVote.votedBelt} width={6} offset={0}
                                    style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>

                    <div style={{margin: '4px 0 0 16px', paddingRight: 8, width: '100%'}}>
                        <div style={{fontSize: '1.0rem', marginTop: 16}}>
                            My Vote: <span
                            style={{fontWeight: 600}}>{userVote.votedBelt} {/black (\d)/.test(userVote.votedBelt?.toLowerCase()) ? '' : ' Belt'}</span>
                        </div>
                        {userVote.comment &&
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {
                                target: '_blank',
                                rel: ['nofollow', 'noopener', 'noreferrer']
                            }]]}>
                                {userVote.comment}
                            </ReactMarkdown>
                        }
                        {userVote.mediaUrl &&
                            <div style={{
                                display: 'flex', flexDirection: 'row', gap: 8,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>
                                <AttachmentIcon fontSize={'small'}/>
                                <a href={userVote.mediaUrl} target='_blank'
                                   rel='nofollow noopener noreferrer'>{userVote.mediaUrl}</a>
                            </div>
                        }

                        <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 8}}>
                            <Button onClick={() => handleActive('voteForm')} variant='text' size='small'
                                    style={{color: '#ddd'}}>Edit</Button>
                        </div>
                    </div>
                </div>
            </Collapse>

            <Collapse in={active.voteForm}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    margin: '16px 0px 0px 0px'
                }}>
                    <BeltStripeMini value={form.form.votedBelt} width={6} offset={26}
                                    style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>
                    <div style={{margin: '0px 0 0 16px', width: '100%'}}>
                        <div style={{fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px'}}>
                            My Vote
                        </div>
                        <FormElement fieldType={'SelectBox'}
                                     fieldName={'votedBelt'}
                                     options={danBelts.slice(0, 13)}
                                     fieldSettings={{
                                         inputWidth: 140,
                                         inputSize: 'small'
                                     }}
                                     form={form}
                                     formDefaults={formDefaults}/>

                        <FormElement fieldType={'TextField'}
                                     fieldName={'comment'}
                                     label={'Comment'}
                                     fieldSettings={{
                                         placeholder: 'Comments are optional, but highly recommended.',
                                         margin: '0 0 16px 0',
                                         inputWidth: '100%',
                                         style: {width: '100%'},
                                         slotProps: {htmlInput: {style: {fontSize: '0.9rem'}}}
                                     }}
                                     rows={5}
                                     fullWidth
                                     form={form}
                                     formDefaults={formDefaults}
                                     color={'info'}
                        />
                        <FormElement fieldType={'TextField'}
                                     fieldName={'mediaUrl'}
                                     label={'Link to related media'}
                                     fieldSettings={{
                                         placeholder: 'Optional link to a video or relevant media.',
                                         margin: '0 0 0 0',
                                         inputWidth: '100%',
                                         style: {width: '100%'},
                                         slotProps: {htmlInput: {style: {fontSize: '0.9rem'}}}
                                     }}
                                     fullWidth
                                     form={form}
                                     formDefaults={formDefaults}
                                     color={'info'}
                                     checkValid={checkValidUrl}
                                     errorMessage={(form.form.mediaUrl && !checkValidUrl(form.form.mediaUrl)) ? 'A valid link is required' : undefined}
                                     after={
                                         <Button variant='text' size='small' color='info'
                                                 style={{}} onClick={fillScorecardLink}>
                                             Fill in link from scorecard
                                         </Button>
                                     }
                        />

                        <div
                            style={{display: 'flex', flexGrow: 1, justifyContent: 'right', marginTop: 16, gap: 10}}>
                            <Button variant='text' size='small' style={{color: '#aaa'}}
                                    onClick={handleCancel}>Cancel</Button>
                            <Button variant='text' size='small' disabled={!form.canSave || form.invalid?.length > 0}
                                    onClick={() => {
                                    }} color='success'>Cast Your Vote</Button>
                        </div>

                    </div>
                </div>
            </Collapse>


            <Collapse in={!userVote.id && !active.voteForm}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16}}>
                    <Button onClick={() => handleActive('voteForm')} variant='text' size='small'
                            style={{color: '#ddd'}}>Add Your Belt Ranking Vote</Button>
                </div>
            </Collapse>
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
