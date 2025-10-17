import React, {useCallback, useState} from 'react'
import {postData, cleanError} from '../../formUtils/postData.jsx'
import GetUserAndProfile from '../../auth/GetUserAndProfile.jsx'
import CopyTextButton from './CopyTextButton.jsx'
import PlatformBeltCountsTable from '../../stats/PlatformBeltCountsTable.jsx'
import PlatformBeltCountsChart from '../../stats/PlatformBeltCountsChart.jsx'
import {uniqueBelts} from '../../data/belts'
import RefreshButton from './RefreshButton.jsx'
import dayjs from 'dayjs'
import Dialog from '@mui/material/Dialog'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import Button from '@mui/material/Button'
import useWindowSize from '../../util/useWindowSize'
import {nodeServerUrl} from '../../data/dataUrls'

const FetchRedditBelts = ({data, refresh}) => {

    const {user} = GetUserAndProfile()
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(undefined)
    const [response, setResponse] = useState(undefined)

    const {discordBeltCounts, redditBeltCounts} = data

    const beltText = uniqueBelts
        .reduce((acc, belt) => {
            const fullBelt = `${belt} Belt`
            return acc + `${fullBelt}\t${discordBeltCounts[fullBelt]}\t${redditBeltCounts[fullBelt]}\n`
        }, 'Belt\tDiscord\tReddit\n')

    const handleRefresh = async () => {

        const formData = new FormData()
        formData.append('time', dayjs().format('YYYY-MM-DD HH:mm:ss'))

        setUploading(true)
        try {
            const url = `${nodeServerUrl}/fetch-reddit-flairs`
            const snackBars = true
            const timeoutDuration = 60000
            try {
                setResponse(await postData({user, url, formData, snackBars, timeoutDuration}))
            } catch (error) {
                console.error('Error fetching reddit belts:', error)
                setUploadError(cleanError(error))
            }
        } catch (_error) {
            console.error('Error fetching reddit belts:', uploadError)
        } finally {
            setUploading(false)
        }
    }

    const handleReload = useCallback(async () => {
        setResponse(undefined)
        setUploading(false)
        setUploadError(undefined)
        await refresh()
    }, [refresh])

    const {flexStyle} = useWindowSize()
    const headerStyle = {margin: '46px 0px 26px 0px', width: '100%', backgroundColor: '#000', textAlign: 'center'}


    return (
        <React.Fragment>
            <div style={{
                maxWidth: 700, padding: 20, marginLeft: 'auto', marginRight: 'auto',
                marginTop: 16, marginBottom: 46, justifyItems: 'center', backgroundColor: '#000',
                textAlign: 'center'
            }}>

                <div style={{fontSize: '1.5rem', ...headerStyle}}>
                    Discord & Reddit Belt Distribution
                </div>
                <div style={{display: flexStyle, marginTop: 0, justifyItems: 'center', backgroundColor: '#000'}}>
                    <PlatformBeltCountsTable data={data}/>
                    <PlatformBeltCountsChart data={data}/>
                </div>

                <div style={{display: 'flex', alignItems: 'center', marginTop: 40, justifyContent: 'center'}}>
                    <RefreshButton handleClick={handleRefresh}/>
                    <div style={{width: 16}}/>
                    <CopyTextButton text={beltText} title={'Reddit Counts'}/>
                </div>
            </div>

            <Dialog open={uploading} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.7}}
            }}>
                <div style={{width: 320, textAlign: 'center', padding: 30}}>
                    <LoadingDisplay message='Fetching Reddit Belts, may take a while.'/>
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
                        }}>Reddit Belts Updated!
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
                        <div style={{fontSize: '0.85rem', fontWeight: 400, marginBottom: 20, textAlign: 'center'}}>
                            Error message: {uploadError?.response?.data?.message || uploadError?.message}
                            {uploadError?.response?.data?.status &&
                                <span> ({uploadError?.response?.data?.status})</span> }
                        </div>


                        <div style={{width: '100%', textAlign: 'center'}}>
                            <Button onClick={handleReload} variant='contained' color='error'
                                    style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                OK
                            </Button>
                        </div>

                    </div>
                </div>
            </Dialog>

        </React.Fragment>

    )
}

export default FetchRedditBelts
