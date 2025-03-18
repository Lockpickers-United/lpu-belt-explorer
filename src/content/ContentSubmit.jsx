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
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import useWindowSize from '../util/useWindowSize.jsx'
import Dialog from '@mui/material/Dialog'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'

function ContentSubmit({profile}) {

    const {updateProfileField} = useContext(DBContext)
    const [lockDetails, setLockDetails] = useState({})
    const [lock, setLock] = useState(undefined)
    const [files, setFiles] = useState([])
    const [response, setResponse] = useState(undefined)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(false)
    const [altLock, setAltLock] = useState(false)
    const [altLockName, setAltLockName] = useState('')

    const [photoCredit, setPhotoCredit] = useState(profile?.photoCredit || profile?.displayName)
    const [initialCredit, setInitialCredit] = useState(photoCredit)

    const dt = dayjs().format('YYYYMMDD-HHMMss')
    const entry = allEntries.find(e => e.id === lockDetails?.lockId)
    const uploadable = (!!lockDetails?.lockName && !!lockDetails?.lockId && !!photoCredit && files.length > 0)

    const prefix = `${lockDetails.lockName}_${lockDetails.lockId}_`.replace('/', '+')
    const suffix = `${photoCredit}`.replace('/', '+')

    const droppedFileNames = files.map(file => {
        return file.name
    })

    const title = files.length === 1 ? 'File' : 'Files'

    const handleFileUpload = async (event) => {
        event.preventDefault()
        setUploading(true)

        const uploadsDir = `${dt}_${prefix}_${suffix}`

        const formData = new FormData()
        files.forEach((file) => {
            const {base, ext} = separateBasename(file.name)
            formData.append('files', file, `${uploadsDir}/${prefix}_${base}_${suffix}.${ext}`)
        })
        formData.append('droppedFileNames', droppedFileNames)
        formData.append('lockFullName', lockDetails.lockFullName)
        formData.append('lockName', lockDetails.lockName)
        formData.append('version', entry?.version)
        formData.append('belt', entry?.belt)
        formData.append('lockId', lockDetails.lockId)
        formData.append('photoCredit', photoCredit)
        formData.append('displayName', profile.displayName)
        formData.append('uploadsDir', uploadsDir)
        formData.append('notes', event.target.notes.value)

        if (initialCredit !== photoCredit) {
            console.log('set photo credit to', photoCredit)
            updateProfileField('photoCredit', photoCredit)
            setInitialCredit(photoCredit)
        }

        await axios.post(
            'https://explore.lpubelts.com:8443/upload', formData,
            {headers: {'Content-Type': 'multipart/form-data'}}
        )
            .then(response => {
                setResponse(response.data)
            })
            .catch(error => {
                setUploadError(true)
                console.error('upload error', error)
            })

        if (uploadError) {
            enqueueSnackbar('Something went wrong! Please try again later.')
        } else {
            setLockDetails([])
            files.forEach(file => URL.revokeObjectURL(file.preview))
            setFiles([])
            setUploading(false)
        }

    }

    const handleChangeLock = useCallback(details => {
        setLockDetails(details)
        setLock(allEntries.find(e => e.id === details.lockId))
    }, [])

    const handleChangeCredit = useCallback(event => {
        const {value} = event.target
        setPhotoCredit(value)
    }, [])

    const handleReload = useCallback(() => {
        setLockDetails({})
        setLock(undefined)
        files.forEach(file => URL.revokeObjectURL(file.preview))
        setFiles([])
        setResponse(undefined)
        setUploading(false)
        setUploadError(false)
        setAltLock(false)
        setAltLockName(undefined)
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
        })
    }, [])

    const searchBoxOpacity = altLock ? 0.5 : 1
    const {flexStyle} = useWindowSize()

    return (

        <div style={{
            maxWidth: 800, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft:8
        }}>

            {!response &&
                <form action={null} encType='multipart/form-data' method='post'
                      onSubmit={handleFileUpload}>

                    <div>
                        <div style={{fontSize: '1.5rem', fontWeight: 500, marginBottom: 10}}>Select Lock</div>
                        <div style={{opacity: searchBoxOpacity}}>
                            <LockEntrySearchBox handleChangeLock={handleChangeLock} allEntries={allEntries}
                                                disabled={altLock}/>
                        </div>

                        <div style={{marginTop: 8}}>
                            <Checkbox onChange={handleAltLockToggle} color='info' size='small' id='notInList'/> Submit photos for a
                            lock
                            not on the site.
                        </div>
                        <Collapse in={altLock} style={{marginTop: 10}}>
                            <span style={{fontSize: '0.9rem'}}>Lock Name</span><br/>
                            <TextField type='text' id='altLockName' name='altLockName' value={altLockName}
                                       style={{width: 400}} onChange={handleAltLockName} color='info'/>
                        </Collapse>
                        <br/><br/>

                        <div style={{display:flexStyle}}>
                            <div style={{marginRight: 50, width: 350}}>
                                <div style={{fontSize: '1.5rem', fontWeight: 500, marginBottom: 10}}>Files to
                                    Upload<br/>
                                </div>
                                <Dropzone files={files} setFiles={setFiles}/>

                                {lock &&
                                    <div>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 500,
                                            marginBottom: 10,
                                            marginTop: 20
                                        }}>
                                            Existing Images<br/>
                                        </div>
                                        {lock.media ?

                                            <div>
                                                <ImageList sx={{width: 350}} variant='masonry' cols={2} gap={8}>
                                                    {lock.media.map((item) => (
                                                        <ImageListItem key={item.thumbnailUrl}>
                                                            <img
                                                                srcSet={`${item.thumbnailUrl}?w=164&fit=crop&auto=format&dpr=2 2x`}
                                                                src={`${item.thumbnailUrl}?w=164&fit=crop&auto=format`}
                                                                alt={item.title}
                                                                loading='lazy'
                                                            />
                                                        </ImageListItem>
                                                    ))}
                                                </ImageList>
                                            </div>
                                            : <span>no images</span>
                                        }
                                    </div>
                                }

                            </div>

                            <div style={{width: 350}}>
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
                                <TextField type='text' name='photoCredit' value={photoCredit} style={{width: 350}}
                                           onChange={handleChangeCredit} color='info'/>
                                <br/><br/>
                                <span style={{fontSize: '0.9rem'}}>Notes</span><br/>
                                <TextField type='text' name='notes' multiline fullWidth rows={3} color='info'
                                           maxLength={1000} id='notes'/>

                                <br/><br/>

                                <Button type='submit' variant='contained' color='info' disabled={!uploadable||uploading}>
                                    Upload
                                </Button>

                            </div>
                        </div>
                        <br/><br/>
                    </div>
                </form>
            }

                <Dialog open={uploading} componentsProps={{
                    backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
                }}>
                    <div style={{width: 320, textAlign: 'center', padding: 30}}>
                        <LoadingDisplay/>
                    </div>
                </Dialog>


            {response &&
                <div style={{display: 'flex'}}>
                    <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                        <div style={{fontSize: '1.7rem', fontWeight: 500, marginBottom: 60, textAlign: 'center'}}>{title} Uploaded!</div>

                        <div style={{width: '100%', textAlign: 'right'}}>
                            <Button onClick={handleReload} variant='contained' color='info'
                                    style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                Submit more photos
                            </Button>
                        </div>

                    </div>
                </div>
            }

        </div>

    )
}

export default ContentSubmit

function separateBasename(file) {
    const lastDotIndex = file.lastIndexOf('.')
    if (lastDotIndex === -1) {
        return { base: file, ext: '' }
    }
    return { base: file.substring(0, lastDotIndex), ext: file.substring(lastDotIndex) }
}
