import React, {useContext, useMemo} from 'react'
import AuthContext from '../../app/AuthContext.jsx'
import ProfileContext from '../../app/ProfileContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {apiServerUrl, dataServer, urls} from '../../data/dataUrls'
import dayjs from 'dayjs'
import Footer from '../../nav/Footer.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'
import useGetRequest from '../../util/useGetRequest.jsx'
import LoadingDisplaySmall from '../../misc/LoadingDisplaySmall.jsx'
import IconButton from '@mui/material/IconButton'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ReportIcon from '@mui/icons-material/Report'
import WarningIcon from '@mui/icons-material/Warning'
import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material'

const statusIndicators = {
    loading: <IconButton><LoadingDisplaySmall style={{marginTop: 0}}/></IconButton>,
    error: <IconButton><ReportIcon color='error'/></IconButton>,
    success: <IconButton><CheckCircleIcon color='success'/></IconButton>,
    'data-error': <IconButton><WarningIcon color='warning'/></IconButton>
}

export default function ServerTestMain() {
    const {user, userClaims, getUserClaims} = useContext(AuthContext)

    const {userId, data, loading, error, isFullProfile} = useContext(ProfileContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    const apiReady = useGetRequest({url: `${apiServerUrl}/ready`})
    const apiProfileSummary = useGetRequest({url: `${apiServerUrl}/api/v1/users/${userId}`, enabled: Boolean(userId)})
    const apiProfileFull = useGetRequest({
        user,
        url: `${apiServerUrl}/api/v1/users/${userId}/profile`,
        enabled: Boolean(userId)
    })
    const apiProfileFullNoAuth = useGetRequest({
        url: `${apiServerUrl}/api/v1/users/${userId}/profile`,
        enabled: Boolean(userId)
    })
    const apiCollectionsLocks = useGetRequest({url: `${apiServerUrl}/api/v1/stats/collections/locks/`})

    const headerStyle = {fontWeight: 700, backgroundColor: '#333', padding: 6, textAlign: 'left', marginTop: 10}
    const varStyle = {fontWeight: 700, paddingRight: 10}
    const rowSx = {
        '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#191919'},
        'td, th': {padding: '3px'}
    }

    const dataServerReady = useGetRequest({url: `${dataServer}/ready.json`})

    function JsonResponseRow({name, url, varStyle}) {
        const response = useGetRequest({url})
        return (
            <TableRow sx={rowSx}>
                <TableCell align='center'>{statusIndicators[response.status]}</TableCell>
                <TableCell style={varStyle}>{name}</TableCell>
                <TableCell>{response.data?.metadata?.updatedDateTime}</TableCell>
            </TableRow>
        )
    }

    const shouldFail = (status => {
        if (status === 'loading') return 'loading'
        return (status === 'error' || status === 'data-error')
            ? 'success'
            : 'error'
    })

    const selectedUserClaims = useMemo(() => userClaims.admin && getUserClaims(user),
        [userClaims, getUserClaims, user])

    const footerBefore = undefined

    return (
        <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

            {loading && <LoadingDisplay/>}

            {!loading && data && !error &&
                <div style={{
                    minWidth: '320px', height: '100%',
                    padding: 20, backgroundColor: '#000',
                    marginLeft: 'auto', marginRight: 'auto',
                    justifyItems: 'center', fontSize: '0.95rem'
                }}>
                    <Table id='serverTest'>
                        <TableHead>
                            <TableRow>
                                <TableCell style={headerStyle}>Status</TableCell>
                                <TableCell style={headerStyle}>Endpoint</TableCell>
                                <TableCell style={headerStyle}>Info</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow style={{height: 10}}></TableRow>

                            <TableRow sx={{'td, th': {padding: '3px', backgroundColor: '#333'}}}>
                                <TableCell>{statusIndicators[apiReady.status]}</TableCell>
                                <TableCell style={varStyle}>API SERVER</TableCell>
                                <TableCell>{apiServerUrl}</TableCell>
                            </TableRow>
                            <TableRow sx={rowSx}>
                                <TableCell align='center'>{statusIndicators[apiReady.status]}</TableCell>
                                <TableCell style={varStyle}>Ready</TableCell>
                                <TableCell>Env: {apiReady.data?.environment} |
                                    Release: {apiReady.data?.releaseId}</TableCell>
                            </TableRow>
                            <TableRow sx={rowSx}>
                                <TableCell align='center'>{statusIndicators[apiProfileSummary.status]}</TableCell>
                                <TableCell style={varStyle}>Profile Summary</TableCell>
                                <TableCell>userId: {apiProfileSummary.data?.data?.userId}</TableCell>
                            </TableRow>
                            <TableRow sx={rowSx}>
                                <TableCell align='center'>{statusIndicators[apiProfileFull.status]}</TableCell>
                                <TableCell style={varStyle}>Profile Full</TableCell>
                                <TableCell>{apiProfileFull.errorMessage}</TableCell>
                            </TableRow>
                            <TableRow sx={rowSx}>
                                <TableCell
                                    align='center'>{statusIndicators[shouldFail(apiProfileFullNoAuth.status)]}</TableCell>
                                <TableCell style={varStyle}>Profile Full (no auth)</TableCell>
                                <TableCell>{apiProfileFullNoAuth.errorMessage}</TableCell>
                            </TableRow>
                            <TableRow sx={rowSx}>
                                <TableCell align='center'>{statusIndicators[apiCollectionsLocks.status]}</TableCell>
                                <TableCell style={varStyle}>Collections | Locks</TableCell>
                                <TableCell>{apiCollectionsLocks.errorMessage}</TableCell>
                            </TableRow>

                            <TableRow style={{height: 20}}></TableRow>

                            <TableRow sx={{'td, th': {padding: '3px', backgroundColor: '#333'}}}>
                                <TableCell>{statusIndicators[dataServerReady.status]}</TableCell>
                                <TableCell style={varStyle}>DATA SERVER</TableCell>
                                <TableCell>{dataServer}</TableCell>
                            </TableRow>
                            {Object.entries(urls).map(([fileName, fileUrl]) => (
                                <JsonResponseRow
                                    key={fileName}
                                    name={fileName}
                                    url={fileUrl}
                                    varStyle={varStyle}
                                />
                            ))}

                            <TableRow style={{height: 10}}></TableRow>

                        </TableBody>
                    </Table>


                    <table id='userInfo'>
                        <thead>
                        <TableRow style={headerStyle}>
                            <th>Parameter</th>
                            <th>Value</th>
                        </TableRow>
                        </thead>
                        <tbody>
                        <TableRow style={{height: 10}}></TableRow>
                        <TableRow>
                            <TableCell style={varStyle}>display name</TableCell>
                            <TableCell>{profile?.displayName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={varStyle}>user id</TableCell>
                            <TableCell>{userId}</TableCell>
                        </TableRow>
                        <TableRow style={{height: 10}}></TableRow>
                        <TableRow>
                            <TableCell style={varStyle}>source</TableCell>
                            <TableCell>{data?.source}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={varStyle}>Is Full Profile</TableCell>
                            <TableCell>{data?.isFullProfile ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                        {(user?.uid === userId) &&
                            <TableRow>
                                <TableCell style={varStyle}>user claims</TableCell>
                                <TableCell>{selectedUserClaims?.join(', ')}</TableCell>
                            </TableRow>
                        }
                        {isFullProfile &&
                            <TableRow>
                                <TableCell style={varStyle}>profile.admin</TableCell>
                                <TableCell>TableRowue</TableCell>
                            </TableRow>
                        }


                        </tbody>
                    </table>

                </div>
            }

            {!loading && (!data || error) &&
                <div style={{
                    minWidth: '320px', height: '100%',
                    padding: 20, backgroundColor: '#000',
                    marginLeft: 'auto', marginRight: 'auto',
                    justifyItems: 'center', fontSize: '0.95rem',
                    textalign: 'center'
                }}>
                    no user
                </div>
            }

            <Footer before={footerBefore}/>
        </LocalizationProvider>
    )
}
