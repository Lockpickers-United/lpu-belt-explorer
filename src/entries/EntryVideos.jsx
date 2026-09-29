import React, {useContext} from 'react'
import {apiServerUrl} from '../data/dataUrls'
import useGetRequest from '../util/useGetRequest.jsx'
import {Table} from '@mui/material'
import Link from '@mui/material/Link'
import openInNewTab from '../util/openInNewTab'
import AppContext from '../app/AppContext.jsx'
import AuthContext from '../app/AuthContext.jsx'

// https://api-dev.lpubelts.com/api/v1/locks/3ac43ea8/videos

export default function EntryVideos({entry}) {
    const {user} = useContext(AuthContext)
    const {modEnabled} = useContext(AppContext)

    const url = `${apiServerUrl}/api/v1/locks/${entry.id}/videos`
    const response = useGetRequest({user, url}) || {data: {}, status: 'error'}
    const videos = response?.data?.data?.videos || []

    if (!modEnabled) return null

    const handleOpenVideo = (video) => {
        openInNewTab(video.url)
    }

    const linkSx = {
        color: '#ccc', textDecoration: 'none', cursor: 'pointer', '&:hover': {
            color: '#fff'
        }
    }

    return (
        <div>
            <Table
                style={{borderCollapse: 'collapse', border: 0, fontSize: '0.9rem'}}
                sx={{
                    'td, th': {
                        border: 0
                    }
                }}>
                <tbody>
                { response.status !== 'success' &&
                    <tr>
                        <td colSpan={3} align='center'>
                            {response.statusIndicator}<br/>
                            {response.errorMessage}
                        </td>
                    </tr>
                }
                {videos.map((video, index) => (
                    <tr key={index}>
                        <td style={{width: 15}}>
                            {video.pickerIsBlackBelt &&
                                <div style={{
                                    height: 15,
                                    width: 15,
                                    borderRadius: '50%',
                                    backgroundColor: '#000',
                                    border: '1px solid #999'
                                }}/>
                            }
                        </td>
                        <td><Link onClick={() => handleOpenVideo(video)} sx={linkSx}>{video.pickerName}</Link></td>
                        <td>{video.date}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}

