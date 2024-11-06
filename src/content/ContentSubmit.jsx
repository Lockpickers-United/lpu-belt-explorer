import React, {useCallback, useContext, useState} from 'react'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LockEntrySearchBox from './LockEntrySearchBox.jsx'
import axios from 'axios'
import allEntries from '../data/data.json'
import BeltIcon from '../entries/BeltIcon.jsx'
import Dropzone from './Dropzone.jsx'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import {Collapse} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'

function ContentSubmit({profile}) {

    const {updateProfileField} = useContext(DBContext)
    const [lockDetails, setLockDetails] = useState({})
    const [files, setFiles] = useState([])
    const [response, setResponse] = useState(null)
    const [uploadError, setUploadError] = useState(false)
    const [altLock, setAltLock] = useState(false)
    const [altLockName, setAltLockName] = useState('')


    const [photoCredit, setPhotoCredit] = useState(profile?.photoCredit || profile?.displayName)
    const [initialCredit, setInitialCredit] = useState(photoCredit)

    const dt = dayjs().format('YYYYMMDD-HHMMss')
    const entry = allEntries.find(e => e.id === lockDetails?.lockId)
    const uploadable = (!!lockDetails?.lockName && !!lockDetails?.lockId && !!photoCredit && files.length > 0)

    const prefix = `${lockDetails.lockName}_${lockDetails.lockId}_${photoCredit}`.replace('/', '+')

    const droppedFileNames = files.map(file => {
        return file.name
    })

    const title = files.length === 1 ? 'File' : 'Files'

    const handleFileUpload = async (event) => {
        event.preventDefault()

        const uploadsDir = `${dt}_${prefix}`

        const formData = new FormData()
        files.forEach((file) => {
            formData.append('files', file, `${uploadsDir}/${prefix}_${file.name}`)
        })
        formData.append('droppedFileNames', droppedFileNames)
        formData.append('lockFullName', lockDetails.lockFullName)
        formData.append('lockName', lockDetails.lockName)
        formData.append('version', entry.version)
        formData.append('belt', entry.belt)
        formData.append('lockId', lockDetails.lockId)
        formData.append('photoCredit', photoCredit)
        formData.append('displayName', profile.displayName)
        formData.append('uploadsDir', `${dt}_${prefix}`)
        formData.append('notes', event.target.notes.value)

        if (initialCredit !== photoCredit) {
            console.log('set photo credit to', photoCredit)
            updateProfileField('photoCredit', photoCredit)
            setInitialCredit(photoCredit)
        }

        await axios.post(
            'https://content.lpubelts.com:8443/api/upload', formData,
            {headers: {'Content-Type': 'multipart/form-data'}}
        )
            .then(response => {
                setResponse(response.data)
            })
            .catch(error => {
                setUploadError(true)
                console.error('error', error)
            })

        if (uploadError) {
            enqueueSnackbar('Something went wrong! Please try again later.')
        } else {
            setLockDetails([])
            files.forEach(file => URL.revokeObjectURL(file.preview))
            setFiles([])
        }

    }

    const handleChangeCredit = useCallback(event => {
        const {value} = event.target
        setPhotoCredit(value)
    }, [])

    const handleReload = useCallback(() => {
        setLockDetails([])
        files.forEach(file => URL.revokeObjectURL(file.preview))
        setFiles([])
        setResponse(null)
    }, [files])

    const handleAltLockToggle = useCallback(() => {
        setAltLock(!altLock)
        setLockDetails([])
    }, [altLock])

    const handleAltLockName = useCallback(event => {
        const {value} = event.target
        setAltLockName(value)
        setLockDetails({
            lockFullName: value,
            lockName: value,
            lockId: 'NOTINLIST',
            lockSameline: null,
            lockMaxSameline: null
        })
    }, [])


    const searchBoxOpacity = altLock ? 0.5 : 1
    return (

        <div style={{
            maxWidth: 700, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46
        }}>

            {!response &&
                <form action={null} encType='multipart/form-data' method='post'
                      onSubmit={handleFileUpload}>

                    <div>
                        <div style={{fontSize: '1.5rem', fontWeight: 500, marginBottom: 10}}>Select Lock</div>
                        <div style={{opacity: searchBoxOpacity}}>
                            <LockEntrySearchBox setLockDetails={setLockDetails} allEntries={allEntries}
                                                disabled={altLock}/>
                        </div>

                        <div style={{marginTop: 8}}>
                            <Checkbox onChange={handleAltLockToggle} color='info' size='small'/> Submit photos for a lock
                            not on the site.
                        </div>
                        <Collapse in={altLock} style={{marginTop: 10}}>
                            <span style={{fontSize: '0.9rem'}}>Lock Name</span><br/>
                            <TextField type='text' name='altLockName' value={altLockName} style={{width: 400}}
                                       onChange={handleAltLockName} color='info'/>
                        </Collapse>
                        <br/><br/>

                        <div style={{display: 'flex'}}>
                            <div style={{marginRight: 50}}>
                                <div style={{fontSize: '1.5rem', fontWeight: 500, marginBottom: 10}}>Files to
                                    Upload<br/>
                                </div>
                                <Dropzone files={files} setFiles={setFiles}/>

                            </div>
                            <div>
                                <div style={{fontSize: '1.5rem', fontWeight: 500, marginBottom: 10}}>Details<br/></div>
                                {lockDetails.lockFullName &&
                                    <span>
                                    <span style={{fontSize: '0.9rem'}}>Lock Name</span><br/>
                                        <div style={{display: 'flex'}}>
                                            {lockDetails.lockId !== 'NOTINLIST' &&
                                                <BeltIcon value={entry?.belt} style={{marginBottom: -10}}/>
                                            }
                                            <div style={{
                                                fontWeight: 700,
                                                fontSize: '1.2rem',
                                                marginLeft: 10
                                            }}>{lockDetails.lockFullName}</div>
                                    </div>

                                            <br/>
                                </span>
                                }
                                <span style={{fontSize: '0.9rem'}}>Credit to</span><br/>
                                <TextField type='text' name='photoCredit' value={photoCredit} style={{width: 400}}
                                           onChange={handleChangeCredit} color='info'/>
                                <br/><br/>
                                <span style={{fontSize: '0.9rem'}}>Notes</span><br/>
                                <TextField type='text' name='notes' multiline fullWidth rows={3} color='info'
                                           maxLength={1000}/>

                                <br/><br/>

                                <Button type='submit' variant='contained' color='info' disabled={!uploadable}>
                                    Upload
                                </Button>

                            </div>
                        </div>
                        <br/><br/>
                    </div>
                </form>
            }

            {
                response &&
                <div style={{display: 'flex'}}>
                    <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                        <div style={{fontSize: '1.5rem', fontWeight: 500, marginBottom: 10}}>{title} Uploaded!</div>

                        <span style={{fontWeight: 700, fontSize: '0.8rem'}}>Lock Name</span><br/>

                        <span
                            style={{fontSize: '1.1rem'}}>{response['lockFullName']}</span>
                        <br/><br/>

                        <span style={{fontWeight: 700, fontSize: '0.8rem'}}>{title}</span><br/>
                        <span
                            style={{fontSize: '1.1rem'}}>
                        {droppedFileNames.map(file =>
                            <div key={file}>• {file}</div>
                        )}
                    </span>
                        <br/>

                        <span style={{fontWeight: 700, fontSize: '0.8rem'}}>Credit to</span><br/>
                        <span
                            style={{fontSize: '1.1rem'}}>{response['photoCredit']}</span>
                        <br/><br/>

                        <div style={{width: '100%', textAlign: 'right'}}>
                            <Button onClick={handleReload} variant='contained' color='info'
                                    style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                Submit more photos!
                            </Button>
                        </div>

                    </div>
                </div>
            }

        </div>

    )
}

export default ContentSubmit

