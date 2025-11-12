import React, {useCallback, useContext, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import {postData, cleanError} from '../../formUtils/postData.jsx'
import {nodeServerUrl} from '../../data/dataUrls'
import {enqueueSnackbar} from 'notistack'
import RaflPotSearchBox from './RaflPotSearchBox.jsx'
import Checkbox from '@mui/material/Checkbox'
import {Collapse} from '@mui/material'
import RaffleContext from '../RaffleContext.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'

/**
 * @prop
 */

export default function RafflePotSubmit({profile, user}) {

    const {allPots=[]} = useContext(RaffleContext)

    const [response, setResponse] = useState(undefined)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(undefined)
    const [form, setForm] = useState({})
    const [lockDetails, setLockDetails] = useState({})
    const [altLock, setAltLock] = useState(false)
    const [altLockName, setAltLockName] = useState('')
    const [reset, setReset] = useState(false)
    const [contentChanged, setContentChanged] = useState(false)

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
        setContentChanged(true)
    }, [form])

    const handleChangeLock = useCallback(details => {
        setLockDetails(details)
        const pot = allPots.find(e => e.id === details.lockId)
        handleFormChange({target: {name:'contributedBy', value: pot?.contributedBy.join(', ') || ''}})
    }, [allPots, handleFormChange])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setUploading(true)
        const formCopy = {
            ...form,
            displayName: form.discordUsername || form.redditUsername || profile?.displayName || 'unknown'
        }

        const formData = new FormData()
        Object.keys(formCopy).forEach(key => {
            formData.append(key, formCopy[key])
        })

        formData.append('subjectText', `Pot info submitted for ${lockDetails.lockFullName} by ${formCopy.displayName || 'unknown'}`)
        formData.append('potName', lockDetails.lockFullName)
        formData.append('potId', lockDetails.lockId)

        const url = `${nodeServerUrl}/email-form`

        try {
            const results = await postData({user, url, formData, snackBars: false, timeoutDuration: 20000})
            enqueueSnackbar('Submit successful', {variant: 'success'})
            setResponse(results)
        } catch (error) {
            setUploadError(cleanError(error))
            enqueueSnackbar(`Error creating request: ${error}`, {variant: 'error', autoHideDuration: 3000})
            // Do not rethrow to avoid Uncaught (in promise) in the console; error is handled via UI state and snackbar.
        } finally {
            setUploading(false)
            setForm(formCopy)
        }
    }

    const handleReload = useCallback(() => {
        setForm({})
        setLockDetails({})
        setReset(!reset)
        setUploading(false)
        setResponse(undefined)
        setUploadError(undefined)
    }, [reset])

    const handleClose = useCallback(() => {
        setUploading(false)
        setResponse(undefined)
        setUploadError(undefined)
    }, [])

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
            lockId: 'NOTINLIST'
        })
    }, [])

    const searchBoxOpacity = altLock ? 0.5 : 1
    const {flexStyle} = useWindowSize()
    const linkSx = {
        color: '#bbb', textDecoration: 'underline', cursor: 'pointer', fontWeight:500, '&:hover': {
            color: '#fff'
        }
    }
    const navigate = useNavigate()


    return (

        <div style={{
            maxWidth: 800, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, paddingLeft: 8
        }}>

            <div style={{fontSize: '1.7rem', fontWeight: 600, marginBottom: 20}}>
                Pot Info  | <Link onClick={()=>navigate('/rafl/photos')} sx={linkSx}>Photos</Link>
            </div>


            <form action={null} encType='multipart/form-data' method='post'
                  onSubmit={handleSubmit}>

                <div style={{display: 'flex', flexDirection: 'column', gap: 16, width: 500}}>
                    <div style={{fontSize: '1.5rem', fontWeight: 500, margin: '0px 0px 0px'}}>Select Pot</div>
                    <div style={{opacity: searchBoxOpacity}}>
                        <RaflPotSearchBox handleChangeLock={handleChangeLock} allEntries={allPots}
                                          disabled={altLock} reset={reset}/>
                    </div>

                    <div style={{marginTop: 0}}>
                        <Checkbox onChange={handleAltLockToggle} color='info' size='small' id='notInList'
                                  checked={altLock}/> Submit
                        photos for a pot not on the site.
                    </div>
                    <Collapse in={altLock} style={{}}>
                        <span style={{fontSize: '0.9rem'}}>Pot Name</span><br/>
                        <TextField type='text' id='altLockName' name='altLockName' value={altLockName}
                                   style={{width: 400, marginBottom: 25}} onChange={handleAltLockName} color='info'/>
                    </Collapse>


                    <TextField
                        label="Contributed by"
                        name="contributedBy"
                        value={form.contributedBy || ''}
                        onChange={handleFormChange}
                        color='info'
                        fullWidth
                    />

                    <TextField
                        label="Pot contents"
                        name="potContents"
                        value={form.potContents || ''}
                        onChange={handleFormChange}
                        fullWidth
                        multiline
                        color='info'
                        minRows={5}
                    />

                    <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                        <div style={{minWidth: 220}}>
                            <TextField
                                label="Number of winners"
                                name="numberOfWinners"
                                value={form.numberOfWinners || ''}
                                onChange={handleFormChange}
                                fullWidth
                                select
                                color='info'
                                SelectProps={{native: true}}
                            >
                                <option aria-label="None" value="" />
                                {Array.from({length: 20}, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </TextField>
                        </div>

                        <TextField
                            label="Country"
                            name="country"
                            value={form.country || ''}
                            onChange={handleFormChange}
                            fullWidth
                            color='info'
                            style={{minWidth: 260}}
                        />
                    </div>

                    <div style={{fontSize: '1.5rem', fontWeight: 500, marginTop: 10}}>Shipping Info</div>

                    <TextField
                        label="Shipping type"
                        name="shippingType"
                        value={form.shippingType || ''}
                        onChange={handleFormChange}
                        fullWidth
                        select
                        color='info'
                        SelectProps={{native: true}}
                    >
                        <option aria-label="None" value="" />
                        <option value="Digital prize">Digital prize</option>
                        <option value="International shipping included">International shipping included</option>
                        <option value="Split international shipping">Split international shipping</option>
                        <option value="Domestic only">Domestic only</option>
                        <option value="Winner pays international shipping">Winner pays international shipping</option>
                    </TextField>

                    {form.shippingType === 'Split international shipping' && (
                        <TextField
                            label="How much will you contribute to intl shipping?"
                            name="splitShippingAmount"
                            value={form.splitShippingAmount || ''}
                            onChange={handleFormChange}
                            color='info'
                            style={{width: 360}}
                        />
                    )}

                    <TextField
                        label="Ships to US?"
                        name="shipsToUS"
                        value={form.shipsToUS || ''}
                        onChange={handleFormChange}
                        fullWidth
                        select
                        color='info'
                        SelectProps={{native: true}}
                    >
                        <option aria-label="None" value="" />
                        <option value="Yes">Yes</option>
                        <option value="Yes, buyer pays shipping + fees">Yes, buyer pays shipping + fees</option>
                        <option value="No">No</option>
                    </TextField>

                    <div style={{marginTop: 10}}>
                        <div style={{marginRight: 50, width: 300}}>
                            <div style={{fontSize: '1.2rem', fontWeight: 600}}>
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
                        </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 8}}>
                        <Button disabled={!contentChanged} type="submit" variant="contained" color="success">Submit</Button>
                    </div>
                </div>



            </form>

            <Dialog open={uploading} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
            }}>
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
                            marginBottom: 10,
                            textAlign: 'center'
                        }}>Submitted Successfully!
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
        </div>
    )
}
