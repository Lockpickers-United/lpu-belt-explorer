import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'
import FormElement from '../formUtils/FormElement.jsx'
import {danBelts} from '../data/belts.js'
import Button from '@mui/material/Button'
import useForm from '../formUtils/useForm.jsx'
import isValidUrl from '../util/isValidUrl.js'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import {apiServerUrl} from '../data/dataUrls.js'
import useGetRequest from '../util/useGetRequest.jsx'
import AuthContext from '../app/AuthContext.jsx'
import {useAccess} from '../app/AccessContext.jsx'
import DBContext from '../app/DBContext.jsx'
import useClassificationCommand from './useClassificationCommand.js'
import {canWriteVotes} from './writeStage.js'
import DeleteButton from '../misc/DeleteButton.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import {enqueueSnackbar} from 'notistack'
import scrollRefToTop from '../util/scrollRefToTop.js'
import ReassignVoteButton from './ReassignVoteButton.jsx'
import DataContext from '../context/DataContext.jsx'
import {useNavigate} from 'react-router-dom'

export default function VoteForm({entry, vote, handleActive, owner, entryRef}) {
    const {user} = useContext(AuthContext)
    const {profile} = useContext(DBContext)
    const {accessInfo} = useAccess()
    const {getEntryFromId} = useContext(DataContext)
    const navigate = useNavigate()
    const {run, pending, error} = useClassificationCommand()
    const [saving, setSaving] = useState(false)
    const hasLock = profile?.recordedLocks?.includes(entry.id)

    const url = `${apiServerUrl}/api/v1/locks/${entry.id}/videos`
    const response = useGetRequest({user, url, enabled: Boolean(hasLock && accessInfo.features.scorecardVideos)})
    const videos = response?.data?.data?.videos ?? []
    const scorecardVideo = videos.find(video => video.userId === user.uid) ?? null

    let form
    const baseForm = useMemo(() => vote, [vote])

    const handleCancel = useCallback(() => {
        form.reload()
        scrollRefToTop(entryRef)
        handleActive && handleActive()
    }, [entryRef, form, handleActive])

    form = useForm({baseForm})
    useEffect(() => {
        if (!form.intialized) {
            form.initialize({
                requiredFields: ['votedBelt'],
                clearOnSubmit: false
            })
        }
    }, [form])

    const fillScorecardLink = useCallback((url) => {
        if (url) {
            form.update({target: {name: 'mediaUrl', value: url}})
        }
    }, [form])

    const checkValidUrl = useCallback(value => {
        return !value || isValidUrl(value)
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const fields = {
            votedBelt: form.form.votedBelt,
            comment: form.form.comment || null,
            mediaUrl: form.form.mediaUrl || null
        }
        try {
            if (vote.id) {
                await run('patch', `votes/${encodeURIComponent(vote.id)}`, {
                    ...fields, expectedRevision: vote.revision
                })
            } else {
                await run('post', 'votes', {entryId: entry.id, ...fields})
            }
            scrollRefToTop(entryRef)
            handleActive?.('saved')
            enqueueSnackbar('Changes saved.')
        } catch {
            setSaving(false)
            // Keep the form and idempotency key available for a safe retry.
        }
    }

    const handleDelete = async () => {
        try {
            await run('delete', `votes/${encodeURIComponent(vote.id)}`, {
                expectedRevision: vote.revision
            })
            handleActive?.('saved')
        } catch {
            // Show the API error next to the form.
        }
    }

    const handleMoveVote = async (id) => {
        const target = getEntryFromId(id)
        if (!target) throw new Error('Lock ID was not found.')
        if (id === entry.id) throw new Error('This vote is already on that lock.')
        await run('post', `votes/${encodeURIComponent(vote.id)}/move`, {
            entryId: id, expectedRevision: vote.revision
        })
        enqueueSnackbar('Vote moved.')
        navigate(`${target.classificationActive ? '/classification' : '/classification/ranked'}?id=${encodeURIComponent(id)}`)
    }

    const {isMobile} = useWindowSize()
    const rows = !isMobile ? 5 : 8
    const buttonText = vote.id
        ? 'Save'
        : isMobile ? 'Vote' : 'Cast Your Vote'

    const linkSx = {
        color: '#ddd', textDecoration: 'none', cursor: 'pointer', '&:hover': {
            color: '#fff'
        }
    }

    return <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        margin: '16px 0px 0px 0px'
    }}>
        <BeltStripeMini value={form.form.votedBelt} width={6} offset={26}
                        style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>
        <div style={{margin: '0px 0 0 16px', width: '100%'}}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
            }}>

                <div>
                    <div style={{fontSize: '1.0rem', fontWeight: 600, margin: '0px 0px 2px 0px'}}>
                        {owner ? 'My Vote' : vote.displayName}
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
                </div>
                {vote.id && <ReassignVoteButton handleMoveVote={handleMoveVote} pending={pending}
                                                disabled={!canWriteVotes} currentEntryId={entry.id}
                                                hasUnsavedEdits={form.changed}/>}
            </div>
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
                         rows={rows}
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
                         after={scorecardVideo &&
                             <Link sx={linkSx} onClick={() => fillScorecardLink(scorecardVideo.url)}>Fill in link from
                                 scorecard</Link>
                         }
            />

            {(pending || saving)
                ? <div role='status' style={{width: '100%', textAlign: 'center', marginTop: 8}}>
                    <LoadingDisplay size={22} thickness={5} style={{marginTop: 8}}/>
                </div>

                : <div style={{display: 'flex', flexGrow: 1, justifyContent: 'right', marginTop: 16, gap: 10}}>
                    {vote.id &&
                        <DeleteButton variant='text' size='small' color='error' disabled={pending || !canWriteVotes}
                                      onClick={handleDelete}>Delete</DeleteButton>}
                    <Button variant='text' size='small' style={{color: '#aaa'}}
                            onClick={handleCancel} disabled={pending}>Cancel</Button>
                    <Button variant='text' size='small'
                            onClick={handleSave}
                            disabled={pending || !canWriteVotes || !form.form.votedBelt || !checkValidUrl(form.form.mediaUrl) ||
                                (Boolean(vote.id) && !form.changed)}
                            color='success' style={{whiteSpace: 'nowrap'}}>{buttonText}</Button>
                </div>
            }

            {!canWriteVotes && <div role='status'>Classification vote writes are not enabled yet.</div>}
            {error && <div role='alert'>Could not save classification vote: {error.message}
                {error.status === 409 && ' Reload this lock before trying again.'}</div>}

        </div>
    </div>
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
