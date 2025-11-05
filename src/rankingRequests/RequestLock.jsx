import React, {useCallback, useContext, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dropzone from '../formUtils/Dropzone.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import Dialog from '@mui/material/Dialog'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Tracker from '../app/Tracker.jsx'
import SelectBox from '../formUtils/SelectBox.jsx'
import {uniqueBelts} from '../data/belts'
import entryName from '../entries/entryName'
import {setDeep, setDeepPush, setDeepUnique} from '../util/setDeep'
import AutoCompleteBox from '../formUtils/AutoCompleteBox.jsx'
import Link from '@mui/material/Link'
import Checkbox from '@mui/material/Checkbox'
import {Collapse} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext.jsx'
import DataContext from '../context/DataContext.jsx'
import {nodeServerUrl} from '../data/dataUrls'
import {postData} from '../formUtils/postData.jsx'
import {enqueueSnackbar} from 'notistack'
import SubNav from '../nav/SubNav.jsx'

/**
 * @prop newBrand
 * @prop allMakes
 */

function RequestLock() {

    const {allEntries} = useContext(DataContext)
    const {user} = useContext(AuthContext)
    const {profile} = useContext(DataContext)
    const [files, setFiles] = useState([])
    const [response, setResponse] = useState(undefined)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(undefined)
    const [acReset, setAcReset] = useState(false)
    const [form, setForm] = useState({id: genHexString(8)})
    const [inputValue, setInputValue] = useState('')

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
    }, [form])

    const handleDroppedFiles = useCallback((allFiles, _zoneId) => {
        setFiles(allFiles)
    }, [])

    const handleAltBrandToggle = useCallback(() => {
        setAcReset(!acReset)
        const formCopy = {...form}
        formCopy.altBrand = !formCopy.altBrand
        if (formCopy.altBrand) {
            formCopy.newBrand = inputValue
            delete formCopy['make']
        } else {
            delete formCopy.newBrand
        }
        setTimeout(() => {
            setForm(formCopy)
        }, 10)
        setTimeout(() => {
            if (formCopy.altBrand) {
                document.getElementById('newBrand').focus()
                document.getElementById('newBrand').select()
            }
        }, 100)
    }, [acReset, form, inputValue])

    const lockData = useMemo(() => {
        return allEntries?.sort((a, b) => entryName(a, 'short').localeCompare(entryName(b, 'short')))
            .reduce((acc, entry) => {
                const versionText = entry.version ? entry.version : undefined
                entry.makeModels.map(lock => {
                    const make = lock.make ? lock.make : lock.model
                    setDeepUnique(acc, ['allMakes'], make.trim())
                    const model = lock.make ? lock.model.trim() : 'Any'
                    setDeepPush(acc, ['makeModels', make], {model, versionText})
                })
                acc.lockingMechanisms = acc.lockingMechanisms || []
                setDeep(acc, ['lockingMechanisms'], entry.lockingMechanisms
                    ? [...new Set([...acc.lockingMechanisms, ...entry.lockingMechanisms, 'Multiple'])].sort()
                    : acc.lockingMechanisms)
                return acc
            }, {})
    }, [allEntries])

    const allMakes = useMemo(() => {
        return lockData.allMakes?.sort((a, b) => {
                return a.localeCompare(b)
            })
    }, [lockData])

    const uploadable = ((form['make'] || form.newBrand)
            && form.model
            && form.lockingMechanisms && form.lockingMechanisms.length > 0
            && (form.redditUsername || form.discordUsername))
        && files.length > 0

    const prefix = `${form.make || form.newBrand}_${form.model}`.replace('/', '+')
    const suffix = form.redditUsername && form.discordUsername
        ? [form.redditUsername, form.discordUsername].join('_').replace('/', '+')
        : `${form.redditUsername || form.discordUsername}`.replace('/', '+')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setUploading(true)
        const formCopy = {
            ...form,
            displayName: profile?.displayName || 'no display name',
            make: form.make || form.newBrand,
            droppedFileNames: files.map(file => file.name),
            requestStatus: 'Submitted'
        }
        delete formCopy.altBrand
        delete formCopy.newBrand

        const formData = new FormData()
        Object.keys(formCopy).forEach(key => {
            formData.append(key, formCopy[key])
        })
        const uploadsDir = `${prefix}-${suffix}`.toLowerCase()

        files.forEach((file) => {
            const {base, ext} = separateBasename(file.name)
            formData.append('files', file, `${uploadsDir}/${prefix}_${base}_${suffix}.${ext}`.toLowerCase())
        })

        const url = `${nodeServerUrl}/request-lock`

        try {
            const results =  await postData({user, url, formData, snackBars: false, timeoutDuration: 20000})
            enqueueSnackbar('Upload successful', {variant: 'success'})
            setResponse(results)
        } catch (error) {
            setUploadError(`${error}`.replace('Error: ', ''))
            enqueueSnackbar(`Error creating request: ${error}`, {variant: 'error', autoHideDuration: 3000})
            // Do not rethrow to avoid Uncaught (in promise) in console; error is handled via UI state and snackbar.
        } finally {
            files.forEach(file => URL.revokeObjectURL(file.preview))
            setFiles([])
            setUploading(false)
            setForm(formCopy)
        }
    }

    const handleReload = useCallback(() => {
        files.forEach(file => URL.revokeObjectURL(file.preview))
        setFiles([])
        setAcReset(!acReset)
        setForm({id: genHexString(8)})
        setResponse(undefined)
        setUploading(false)
        setUploadError(undefined)
        setTimeout(() => {
            window.scrollTo({
                left: 0,
                top:0,
                behavior: 'smooth'
            })
        }, 100)

    }, [acReset, files])

    //TODO: clear form on error OK
    const handleClose = useCallback(() => {
        setResponse(undefined)
        setUploading(false)
        setUploadError(undefined)
    }, [])

    const options = useMemo(() => {
        return [
            {label: 'Request a Lock', page: '/rankingrequests/submit'},
            {label: 'View Requests', page: '/rankingrequests/view'}
        ]
    }, [])
    const navigate = useNavigate()

    const brandBoxOpacity = form.altBrand > 0 ? 0.5 : 1
    const {isMobile, flexStyle} = useWindowSize()
    const fullWidth = !isMobile ? 660 : 300
    const paddingLeft = !isMobile ? 16 : 8

    return (

        <React.Fragment>
            <SubNav options={options} defaultValue={options[0].label}/>

            <div style={{
                maxWidth: 720, padding: 0,
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
            }}>
                <div style={{marginBottom: 30, marginRight: paddingLeft, lineHeight: '1.5rem'}}>
                    The lock ranking process for Lockpickers United is a detailed one. It&#39;s a community process and
                    identifying new locks for ranking is a big part of it. Use the form below to submit a lock for
                    ranking. A lot of work goes into adding a new lock to the belt rankings, please provide as much
                    information as possible to do your part in the process.
                    <br/><br/>
                    Please note that while all requests will be considered, not all locks can be put into the ranking
                    process. Factors include the availability of locks to review, general availability of locks to the
                    community, access to photos and detailed lock information, and the projected value to the community
                    of adding them to the list.
                    &nbsp;<Link onClick={() => navigate('/view?pageId=classificationProcess')}
                                style={{color: '#aaa', cursor: 'pointer', fontWeight: 700}}>Click here to learn
                    more</Link>

                </div>

                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    padding: `10px ${paddingLeft}px`,
                    backgroundColor: '#222',
                    marginBottom: 20
                }}>
                    Lock Request Info
                </div>
                <form action={null} encType='multipart/form-data' method='post'
                      onSubmit={handleSubmit}>
                    <div style={{paddingLeft: paddingLeft}}>

                        <div style={{display: flexStyle, marginBottom: 30}}>
                            <div>
                                <Collapse in={!form.altBrand}>
                                    <div style={{marginRight: 20}}>
                                        <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>
                                            Choose Brand
                                        </div>
                                        <AutoCompleteBox changeHandler={handleFormChange}
                                                         options={allMakes}
                                                         name={'make'} style={{width: 300, opacity: brandBoxOpacity}}
                                                         reset={acReset} disabled={form.altBrand}
                                                         inputValueHandler={setInputValue}
                                                         noOptionsMessage={'Add a brand'}
                                                         noOptionsHandler={handleAltBrandToggle}/>
                                    </div>
                                </Collapse>
                                <Collapse in={form.altBrand}>
                                    <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>
                                        Enter New Brand
                                    </div>
                                    <TextField type='text' id='newBrand' name='newBrand' value={form.newBrand || ''}
                                               style={{width: 300, marginBottom: 0}} onChange={handleFormChange}
                                               color='info'/>
                                </Collapse>
                                <div style={{marginTop: 8}}>
                                    <Checkbox onChange={handleAltBrandToggle} id='altBrand' name='altBrand'
                                              checked={form.altBrand || false} color='info' size='small'
                                              inputProps={{
                                                  tabIndex: -1
                                              }}/>
                                    <Link onClick={handleAltBrandToggle} style={{color: '#fff'}}>
                                        Submit a lock for a new brand.
                                    </Link>
                                </div>
                            </div>

                            <div style={{marginTop: 0}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>Model Name</div>
                                <TextField type='text' name='model' style={{width: 300}}
                                           onChange={handleFormChange} value={form.model || ''} color='info'/>
                            </div>

                        </div>

                        <div style={{display: flexStyle, marginTop: 20}}>
                            <div style={{marginRight: 20}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>
                                    Locking Mechanism
                                </div>
                                <SelectBox changeHandler={handleFormChange}
                                           name='lockingMechanisms' form={form}
                                           optionsList={lockData.lockingMechanisms} size={'large'}
                                           width={200} multiple={false} defaultValue={''}/>
                            </div>

                            <div style={{flexGrow: 1, maxWidth: 440}}>
                                <div style={{fontSize: '1.1rem'}}>
                                    Notes <span style={{color: '#aaa'}}>(optional)</span>
                                </div>
                                <TextField type='text' name='notes' multiline fullWidth rows={4}
                                           color='info'
                                           style={{}} value={form.notes || ''}
                                           maxLength={1200} id='notes' onChange={handleFormChange}/>
                            </div>

                        </div>

                        <div style={{width: fullWidth, marginTop: 30}}>
                            <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>
                                Lock Photos (at least 1 required)<br/>
                                <span style={{fontSize: '1.0rem', fontWeight: 400}}>Please include body, key, keyway, and if guttable, pictures of all relevant features</span>
                            </div>

                            <Dropzone files={files || []} otherFiles={[]}
                                      handleDroppedFiles={handleDroppedFiles}
                                      maxFiles={5}
                                      backgroundColor={'#333'}/>

                        </div>

                        <div style={{display: flexStyle, marginTop: 30, width: fullWidth}}>
                            <div style={{marginRight: 20}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 400, marginBottom: 5}}>
                                    Approximate Belt <span style={{color: '#aaa'}}>(optional)</span></div>
                                <SelectBox changeHandler={handleFormChange}
                                           name='approxBelt' form={form} optionsList={uniqueBelts}
                                           multiple={false} defaultValue={''}
                                           size={'large'} width={300}/>
                            </div>

                            <div style={{marginTop: 0, width: 300}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 400, marginBottom: 5}}>
                                    Can you provide locks for review?
                                </div>
                                <SelectBox changeHandler={handleFormChange}
                                           name='hazLocc' form={form}
                                           optionsList={['Yes', 'No']}
                                           multiple={false} defaultValue={''}
                                           size={'large'} width={300}/>
                            </div>


                        </div>

                        <div style={{marginTop: 30}}>
                            <div style={{marginRight: 50, width: 300}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 500}}>
                                    Contact Info
                                </div>
                            </div>

                            <div style={{display: flexStyle}}>
                                <div style={{marginRight: 20}}>
                                    <div style={{fontSize: '1rem'}}>Discord Username</div>
                                    <TextField type='text' name='discordUsername' style={{width: 200}}
                                               onChange={handleFormChange} value={form.discordUsername || ''}
                                               color='info'/>
                                </div>

                                <div style={{marginRight: 40}}>
                                    <div style={{fontSize: '1rem'}}>AND/OR Reddit Username</div>
                                    <TextField type='text' name='redditUsername' style={{width: 200}}
                                               onChange={handleFormChange} value={form.redditUsername || ''}
                                               color='info'/>
                                </div>

                                <div style={{marginTop: 0}}>
                                    <div style={{fontSize: '1rem'}}>
                                        Your current belt <span style={{color: '#aaa'}}>(optional)</span>
                                    </div>
                                    <SelectBox changeHandler={handleFormChange}
                                               name='userBelt' form={form}
                                               optionsList={['Unranked', ...uniqueBelts]}
                                               multiple={false} defaultValue={''}
                                               size={'large'} width={200}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{marginTop: 30, width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <Button type='submit' variant='contained' color='info'
                                disabled={!uploadable || uploading}>
                            Submit
                        </Button>
                    </div>

                </form>


                <Dialog open={uploading} componentsProps={{backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}}}>
                    <div style={{width: 320, textAlign: 'center', padding: 30}}>
                        <LoadingDisplay/>
                    </div>
                </Dialog>

                <Dialog open={!!response && !uploadError} componentsProps={{
                    backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
                }}>
                    <div style={{display: 'flex'}}>
                        <div style={{backgroundColor: '#444', marginLeft: 'auto', marginRight: 'auto', padding: 40}}>
                            <div style={{
                                fontSize: '1.7rem',
                                fontWeight: 500,
                                marginBottom: 60,
                                textAlign: 'center'
                            }}>Lock request submitted!
                            </div>

                            <div style={{width: '100%', textAlign: 'center'}}>
                                <Button onClick={handleReload} variant='contained' color='info'
                                        style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                    OK
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>


                <Dialog open={!!uploadError} componentsProps={{
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
                <Tracker feature='uploadPhotos'/>
            </div>
        </React.Fragment>

    )
}

export default RequestLock

function separateBasename(file) {
    const lastDotIndex = file.lastIndexOf('.')
    if (lastDotIndex === -1) {
        return {base: file, ext: ''}
    }
    return {base: file.substring(0, lastDotIndex), ext: file.substring(lastDotIndex)}
}

function genHexString(len) {
    const hex = '0123456789ABCDEF'
    let output = ''
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length))
    }
    return output.toLowerCase()
}