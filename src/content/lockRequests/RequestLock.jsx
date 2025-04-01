import React, {useCallback, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import Dropzone from '../Dropzone.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import Dialog from '@mui/material/Dialog'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import Tracker from '../../app/Tracker.jsx'
import SelectBox from '../SelectBox.jsx'
import {uniqueBelts} from '../../data/belts'
import entryName from '../../entries/entryName'
import {setDeep, setDeepPush, setDeepUnique} from '../../util/setDeep'
import AutoCompleteBox from '../AutoCompleteBox.jsx'
import Link from '@mui/material/Link'
import Checkbox from '@mui/material/Checkbox'
import {Collapse} from '@mui/material'
import allEntries from '../../data/data.json'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChoiceButtonGroup from '../../util/ChoiceButtonGroup.jsx'
import {useNavigate} from 'react-router-dom'

/**
 * @prop newBrand
 * @prop allMakes
 */

function RequestLock({profile, refresh}) {

    const [files, setFiles] = useState([])
    const [response, setResponse] = useState(undefined)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(false)
    const [acReset, setAcReset] = useState(false)
    const [form, setForm] = useState({id: genHexString(8)})

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
    }, [form])

    const handleAltBrandToggle = useCallback(() => {
        setAcReset(!acReset)
        const formCopy = {...form}
        delete formCopy['make']
        delete formCopy.newBrand
        formCopy.altBrand = !formCopy.altBrand
        setTimeout(() => setForm(formCopy), 10)
    }, [acReset, form])

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
                acc.features = acc.features || []
                setDeep(acc, ['features'], entry.features
                    ? [...new Set([...acc.features, ...entry.features])].sort()
                    : acc.features)
                return acc
            }, {})
    }, [])

    const uploadable = ((form['make'] || form.newBrand) && form.model && (form.redditUsername || form.discordUsername))
    const prefix = `${form.make || form.newBrand}_${form.model}`.replace('/', '+')
    const suffix = form.redditUsername && form.discordUsername
        ? [form.redditUsername, form.discordUsername].join('_').replace('/', '+')
        : `${form.redditUsername || form.discordUsername}`.replace('/', '+')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setUploading(true)

        const formCopy = {...form}
        delete formCopy.altBrand
        delete formCopy.newBrand

        setForm(formCopy)

        setForm({
            ...form,
            displayName: profile?.displayName,

            make: form.make || form.newBrand,
            droppedFileNames: files.map(file => {
                return file.name
            })
        })

        console.log('form', form)

        const formData = new FormData()
        Object.keys(form).forEach(key => {
            formData.append(key, form[key])
        })

        const uploadsDir = `${prefix}-${suffix}`.toLowerCase()

        files.forEach((file) => {
            const {base, ext} = separateBasename(file.name)
            formData.append('files', file, `${uploadsDir}/${prefix}_${base}_${suffix}.${ext}`.toLowerCase())
        })

        await axios.post(
            'https://explore.lpubelts.com:8443/request-lock', formData,
            {headers: {'Content-Type': 'multipart/form-data'}}
        )
            .then(response => {
                setResponse(response.data)
                //console.log('response.data', response.data)
            })
            .catch(error => {
                console.error('upload error', error)
                setUploadError(error)
            })

        if (!uploadError) {
            files.forEach(file => URL.revokeObjectURL(file.preview))
            setFiles([])
            setUploading(false)
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
        refresh()
    }, [acReset, files, refresh])

    const handleClose = useCallback(() => {
        setResponse(undefined)
        setUploading(false)
        setUploadError(undefined)
    }, [])

    const options = useMemo(() => {
        return [
            {label: 'Request a Lock', page: '/content/lockrequest'},
            {label: 'View Requests', page: '/content/lockrequest/view'}
        ]
    }, [])
    const navigate = useNavigate()
    const [selected, setSelected] = useState(options[0]) //eslint-disable-line
    const handleChange = useCallback(newValue => {
        setSelected(newValue)
        navigate(newValue.page)
    }, [navigate])

    const brandBoxOpacity = form.altBrand > 0 ? 0.5 : 1
    const {isMobile, flexStyle} = useWindowSize()

    const gutter = isMobile ? 4 : 40

    return (

        <React.Fragment>

            <div style={{marginBottom: 20, marginTop: 1}}>
                <ChoiceButtonGroup options={options} onChange={handleChange} defaultValue={options[0].label}/>
            </div>

            <div style={{
                maxWidth: 720, padding: 0,
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
            }}>

                <Link onClick={() => console.log('form', form)} style={{color: '#444', cursor: 'pointer'}}>LOG</Link>
                &nbsp; &nbsp; <Link onClick={() => handleReload()}
                                    style={{color: '#444', cursor: 'pointer'}}>RELOAD</Link>

                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    padding: '10px 16px',
                    backgroundColor: '#222',
                    marginBottom: 20
                }}>
                    Lock Request Info
                </div>
                <form action={null} encType='multipart/form-data' method='post'
                      onSubmit={handleSubmit}>
                    <div style={{display: flexStyle, marginLeft: 16}}>
                        <div style={{display: flexStyle}}>
                            <div>
                                <div style={{marginRight: 20}}>
                                    <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 5}}>Choose Brand
                                    </div>
                                    <AutoCompleteBox changeHandler={handleFormChange} options={lockData.allMakes.sort()}
                                                     name={'make'} style={{width: 300, opacity: brandBoxOpacity}}
                                                     reset={acReset} disabled={form.altBrand}/>
                                </div>

                                <div style={{marginTop: 8}}>
                                    <Checkbox onChange={handleAltBrandToggle} id='altBrand' name='altBrand'
                                              checked={form.altBrand || false} color='info' size='small'/>
                                    <Link onClick={() => handleAltBrandToggle()} style={{color: '#fff'}}>
                                        Submit a lock for a new brand.
                                    </Link>
                                </div>
                                <Collapse in={form.altBrand}>
                                    <div style={{fontSize: '0.9rem'}}>Enter New Brand</div>
                                    <TextField type='text' id='newBrand' name='newBrand' value={form.newBrand || ''}
                                               style={{width: 300, marginBottom: 10}} onChange={handleFormChange}
                                               color='info'/>
                                </Collapse>

                                <div style={{marginTop: 20}}>
                                    <div style={{fontSize: '1.1rem', fontWeight: 500}}>Model Name</div>
                                    <TextField type='text' name='model' style={{width: 300}}
                                               onChange={handleFormChange} value={form.model || ''} color='info'/>
                                </div>

                            </div>
                            <div>
                                <div style={{marginLeft: gutter, marginBottom: 40}}>

                                    <div style={{marginRight: 50, width: 300}}>
                                        <div style={{fontSize: '1.1rem', fontWeight: 500}}>
                                            Contact Info
                                        </div>
                                    </div>

                                    <div style={{marginTop: 10}}>
                                        <div style={{fontSize: '1rem'}}>Discord Username</div>
                                        <TextField type='text' name='discordUsername' style={{width: 300}}
                                                   onChange={handleFormChange} value={form.discordUsername || ''}
                                                   color='info'/>
                                    </div>

                                    <div style={{marginTop: 5}}>
                                        <div style={{fontSize: '1rem'}}>AND/OR Reddit Username</div>
                                        <TextField type='text' name='redditUsername' style={{width: 300}}
                                                   onChange={handleFormChange} value={form.redditUsername || ''}
                                                   color='info'/>
                                    </div>

                                    <div style={{marginTop: 20}}>
                                        <div style={{fontSize: '1rem'}}>
                                            Your current belt <span style={{color: '#aaa'}}>(optional)</span>
                                        </div>
                                        <SelectBox changeHandler={handleFormChange}
                                                   name='userBelt' form={form}
                                                   optionsList={['Unranked', ...uniqueBelts]}
                                                   multiple={false} defaultValue={''}
                                                   size={'large'} width={300}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <div style={{fontSize: '1.5rem', fontWeight: 500, marginBottom: 0, marginTop: 0}}>
                                    Add Details (optional)
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>

                                <div style={{display: flexStyle, marginLeft: 2}}>
                                    <div>
                                        <div style={{marginTop: 0}}>
                                            <div style={{fontSize: '1rem'}}>
                                                Locking Mechanism <span style={{color: '#aaa'}}>(optional)</span>
                                            </div>
                                            <SelectBox changeHandler={handleFormChange}
                                                       name='lockingMechanisms' form={form}
                                                       optionsList={lockData.lockingMechanisms} size={'large'}
                                                       width={300}
                                                       multiple={true} defaultValue={[]}/>
                                        </div>

                                        <div style={{marginTop: 20}}>
                                            <div style={{fontSize: '1rem'}}>
                                                Features <span style={{color: '#aaa'}}>(optional)</span>
                                            </div>
                                            <SelectBox changeHandler={handleFormChange}
                                                       name='features' form={form} optionsList={lockData.features}
                                                       multiple={true} defaultValue={[]}
                                                       size={'large'} width={300}/>
                                        </div>

                                    </div>
                                    <div style={{marginLeft: gutter}}>
                                        <div>
                                            <div style={{fontSize: '1rem'}}>
                                                Approximate Belt <span style={{color: '#aaa'}}>(optional)</span></div>
                                            <SelectBox changeHandler={handleFormChange}
                                                       name='approxBelt' form={form} optionsList={uniqueBelts}
                                                       multiple={false} defaultValue={''}
                                                       size={'large'} width={300}/>
                                        </div>

                                        <div style={{marginTop: 20}}>
                                            <div style={{fontSize: '1rem'}}>
                                                Notes <span style={{color: '#aaa'}}>(optional)</span>
                                            </div>
                                            <TextField type='text' name='notes' multiline fullWidth rows={3}
                                                       color='info'
                                                       style={{width: 300}} value={form.notes || ''}
                                                       maxLength={1000} id='notes' onChange={handleFormChange}/>
                                        </div>
                                    </div>
                                </div>
                                <div style={{width: '100%', marginTop: 20}}>
                                    <div style={{fontSize: '1.1rem', marginBottom: 10}}>
                                        Please upload photos if you can
                                    </div>
                                    <Dropzone files={files} setFiles={setFiles}/>
                                </div>

                            </AccordionDetails>
                        </Accordion>


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
                                    Submit another request
                                </Button>
                                <br/><br/>
                                <Button onClick={handleClose} variant='contained' color='warning'
                                        style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                    Close Only
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
                            <div style={{fontSize: '0.85rem', fontWeight: 400, marginBottom: 20, textAlign: 'center'}}>
                                Error message: {uploadError?.response?.data}
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