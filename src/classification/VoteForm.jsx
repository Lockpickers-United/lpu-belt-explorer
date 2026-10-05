import {useCallback, useContext, useEffect, useMemo} from 'react'
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

export default function VoteForm({entry, vote, handleActive, owner}) {
    const {user} = useContext(AuthContext)
    const {lockCollection} = useContext(DBContext)
    const {accessInfo} = useAccess()

    const hasLock = lockCollection?.recordedLocks.includes(entry.id)

    const url = `${apiServerUrl}/api/v1/locks/${entry.id}/videos`
    const response = useGetRequest({user, url, enabled: hasLock && accessInfo.features.scorecardVideos})
    const videos = response?.data?.data?.videos ?? []
    const scorecardVideo = videos.find(video => video.userId === user.uid) ?? null

    let form
    const baseForm = useMemo(() => vote, [vote])

    const handleCancel = useCallback(() => {
        form.reload()
        handleActive && handleActive()
    }, [form, handleActive])

    const handleSubmit = useCallback((_form) => {
        console.log('handleSubmit called')
        //    const {saveSurveySubmission} = useContext(DBContext)
    }, [])

    form = useForm({baseForm, handleSubmit})
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
        return isValidUrl(value)
    }, [])


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
                         after={ scorecardVideo &&
                             <Link sx={linkSx} onClick={() => fillScorecardLink(scorecardVideo.url)}>Fill in link from scorecard</Link>
                         }
            />

            <div style={{display: 'flex', flexGrow: 1, justifyContent: 'right', marginTop: 16, gap: 10}}>
                {vote.id &&
                    <Button variant='text' size='small' style={{color: '#e12121', marginRight: 40}}
                            onClick={handleCancel}>Delete</Button>
                }
                <Button variant='text' size='small' style={{color: '#aaa'}}
                        onClick={handleCancel}>Cancel</Button>
                <Button variant='text' size='small' disabled={form.canSave || form.invalid?.length > 0}
                        color='success' style={{whiteSpace: 'nowrap'}}>{buttonText}</Button>
            </div>

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
