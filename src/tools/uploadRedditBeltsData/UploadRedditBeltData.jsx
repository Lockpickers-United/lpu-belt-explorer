import React, {useState} from 'react'
import {postData, cleanError} from '../../formUtils/postData.jsx'
import GetUserAndProfile from '../../auth/GetUserAndProfile.jsx'
import RedditBeltCountsTable from './RedditBeltCountsTable.jsx'
import CopyTextButton from './CopyTextButton.jsx'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {nodeServer} from '../../formUtils/nodeServerUrl'

const UploadRedditBeltsData = () => {

    const {user} = GetUserAndProfile()
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(undefined)
    const [response, setResponse] = useState(undefined)


    const beltText = response && response.data
        ? Object.keys(response.data)
            .filter(belt => belt.includes('Belt'))
            .reduce((acc, belt) => {
                return acc + `${belt}\t${response.data[belt]}\n`
            }, '')
        : ''

    // Handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    // Handle file upload
    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file first!')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        setUploading(true)

        try {
            const url = `${nodeServer}/uploadRedditBelts`
            const snackBars = true
            const timeoutDuration = 10000
            try {
                setResponse(await postData({user, url, formData, snackBars, timeoutDuration}))
            } catch (error) {
                console.error('Error uploading file:', error)
                setUploadError(cleanError(error))
            } finally {
                setUploading(false)
            }

            //console.log(response.data) // Handle the response from your server here

        } catch (error) {
            console.error('Error uploading file:', uploadError)
        } finally {
            setUploading(false)
        }
    }


    return (
        <div style={{
            maxWidth: 700, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46, justifyItems: 'center'
        }}>
            <h2>Upload Reddit Flair Data File</h2>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 16}}>
                <TextField
                    type='file' style={{marginRight: 16}}
                    onChange={handleFileChange}
                />
                <Button onClick={handleFileUpload} disabled={!file || uploading} color='secondary' variant='contained' size='small'>
                    Upload
                </Button>
            </div>

            {response && response.data &&
                <div style={{marginTop: 36, justifyItems: 'center'}}>
                    <RedditBeltCountsTable data={response.data}/>
                    <div style={{height: 18}}/>
                    <CopyTextButton text={beltText} title={'Reddit Counts'}/>
                </div>
            }

        </div>
    )
}

export default UploadRedditBeltsData
