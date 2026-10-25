import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RaffleContext from './RaffleContext.jsx'
import {useNavigate, useSearchParams} from 'react-router-dom'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import VisibilityIcon from '@mui/icons-material/Visibility'

function AdminToolButtons() {
    const {
        raffleAdmin,
        raffleAdminRole,
        setRaffleAdminRole,
        preview,
        setPreview,
        setAnimateTotal
    } = useContext(RaffleContext)
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const previewMode = searchParams.has('preview')
    const showPreview = preview || previewMode

    const togglePreview = useCallback(() => {
        if (previewMode) {
            searchParams.delete('preview')
            setSearchParams(searchParams)
            setPreview(false)
        } else {
            setPreview(!preview)
        }
    }, [preview, previewMode, searchParams, setPreview, setSearchParams])

    const previewColor = showPreview ? '#983de6' : '#fff'

    const handleRoleClick = useCallback(() => {
        if (preview && raffleAdminRole) setPreview(false)
        const isAdminRole = raffleAdminRole
        setRaffleAdminRole(!raffleAdminRole)
        if (isAdminRole) navigate('/rafl')
    }, [navigate, preview, raffleAdminRole, setPreview, setRaffleAdminRole])

    const page = window.location.hash
    const handleChange = useCallback(() => {
        const destination = page === '#/rafl/admin/drawing' ? '/rafl/admin' : '/rafl/admin/drawing'
        navigate(destination)
        setAnimateTotal(false)
    }, [navigate, page, setAnimateTotal])

    const toolTip = raffleAdminRole ? 'Disable Admin Features' : 'Enable Admin Features'
    const color = raffleAdminRole ? '#4c82fd' : '#fff'
    const drawColor = page === '#/rafl/admin/drawing' ? '#64bb08' : '#fff'

    if (!raffleAdmin) return null

    return (
        <React.Fragment>
            {raffleAdminRole &&
                <Tooltip title={'Draw Winners'} arrow disableFocusListener>
                    <IconButton onClick={handleChange} style={{height: 48, width: 48}}>
                        <EmojiEventsIcon style={{color: drawColor}}/>
                    </IconButton>
                </Tooltip>
            }
            {showPreview &&
                <Tooltip title='Toggle Preview Mode' arrow disableFocusListener>
                    <IconButton onClick={togglePreview} style={{padding: 8}}>
                        <VisibilityIcon style={{color: previewColor}} fontSize='small'/>
                    </IconButton>
                </Tooltip>
            }
            <Tooltip title={toolTip} arrow disableFocusListener>
                <IconButton onClick={() => handleRoleClick()} style={{height: 48, width: 48}}>
                    <AdminPanelSettingsIcon style={{color: color}}/>
                </IconButton>
            </Tooltip>
        </React.Fragment>

    )
}

export default AdminToolButtons
