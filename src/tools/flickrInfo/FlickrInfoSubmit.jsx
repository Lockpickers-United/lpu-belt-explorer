import React, {useCallback, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import {enqueueSnackbar} from 'notistack'
import CopyMediaDataButton from './CopyMediaDataButton.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'

function ContentSubmit() {

    const [photosetId, setPhotosetId] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null)
    const [uploadError, setUploadError] = useState(false)
    const {flexStyle} = useWindowSize()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append('photosetId', photosetId)
        await axios.get(
            `https://explore.lpubelts.com:8443/flickr-info?id=${photosetId}`,
            {}
        )
            .then(response => {
                setResponse(response.data)
                setLoading(false)
            })
            .catch(error => {
                setUploadError(true)
                console.error('error', error)
            })
        if (uploadError) {
            enqueueSnackbar('Something went wrong! Please try again later.')
        }
    }

    const handleChangePhotoset = useCallback(event => {
        const {value} = event.target
        setPhotosetId(value)
    }, [])

    const errorStack = response?.error ? JSON.stringify(response?.error, null, 2) : undefined
    const errorText = errorStack ? errorStack.split('\\n') : ''

    const blank = ''
    const mediaData = !response || response?.error
        ? ''
        : response.photos.reduce((acc, photo) => {
            const {seq, title, credit, fullURL, thumbnailURL, originalURL} = photo
            const rights = 'CC BY-NC-SA 4.0'
            const string = [seq, title, credit, rights, blank, thumbnailURL, fullURL, blank, originalURL].join('\t') + '\n'
            return acc + string
        }, '')

    const buttonColors = !loading
        ? {backgroundColor: '#7c9de5', color: '#000'}
        : {backgroundColor: '#555', color: '#373737'}

    return (
        <div style={{
            maxWidth: 700, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46
        }}>

            <form action={null} encType='multipart/form-data' method='post'
                  onSubmit={handleSubmit}>
                <div style={{display: flexStyle, marginBottom: 50, marginTop: 25, alignItems: 'bottom'}}>
                    <div>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 700
                        }}>Enter Photoset ID (e.g. 72177720322353676)</span><br/>
                        <TextField type='text' name='photosetId' value={photosetId} style={{width: 300}}
                                   onChange={handleChangePhotoset} color='info' size='small'/>
                    </div>

                    <div style={{display: 'flex', alignItems: 'end'}}>

                        <Button onClick={handleSubmit} variant='contained' size='small' disabled={loading}
                                style={{marginLeft: 20, height: 40, ...buttonColors}}>
                            Get Photoset Info
                        </Button>
                    </div>
                </div>
            </form>

            {
                response && response.error &&
                <div style={{}}>
                    <div style={{
                        backgroundColor: '#ae3737',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        padding: '20px 20px',
                        fontSize: '1.4rem',
                        fontWeight: 700
                    }}>
                        <div>Error</div>
                        <div style={{fontSize: '1.1rem', fontWeight: 400}}>
                            {
                                errorText?.map((line, index) =>
                                    <div key={index}>{line}</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            }

            {
                response && !response.error &&
                <div style={{}}>

                    <div style={{
                        backgroundColor: '#444',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        padding: '20px 20px',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        display: 'flex'
                    }}>
                        <div style={{flexGrow: 1}}>PHOTOSET IMAGE DATA</div>
                        <CopyMediaDataButton mediaData={mediaData}/>
                    </div>

                    <div style={{
                        backgroundColor: '#222',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        padding: '20px 20px',
                        fontSize: '0.86rem'
                    }}>

                        <div style={{
                            fontWeight: 600,
                            fontSize: '1.3rem',
                            marginBottom: 20
                        }}>{`${response?.title} (${response?.photoCount} photos)`}</div>

                        {response.photos.map(photo =>
                            <div key={photo.seq} style={{marginBottom: 20}}>
                                <div style={{fontWeight: 600, fontSize: '1rem'}}>{`${photo.seq}. ${photo.title}`}</div>
                                <div style={{fontWeight: 400}}>{`fullURL: ${photo.fullURL}`}</div>
                                <div style={{fontWeight: 400}}>{`originalURL: ${photo.originalURL}`}</div>
                                <div style={{fontWeight: 400}}>{`thumbnailURL: ${photo.thumbnailURL}`}</div>
                            </div>
                        )
                        }

                    </div>
                </div>
            }
        </div>
    )
}

export default ContentSubmit

