import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import AppContext from '../app/AppContext.jsx'
import {useSearchParams} from 'react-router-dom'
import RaffleContext from './RaffleContext.jsx'

function PreviewButton() {
    const {raffleAdminRole} = useContext(RaffleContext)
    const {preview, setPreview} = useContext(AppContext)
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

    useHotkeys('p', () => togglePreview(), {preventDefault: true})

    const color = showPreview ? '#983de6' : '#fff'

    if (!raffleAdminRole) return null

    return (
        <Tooltip title='Toggle Preview Mode' arrow disableFocusListener>
            <IconButton onClick={togglePreview} style={{height: 48, width: 48}}>
                <VisibilityIcon style={{color: color}}/>
            </IconButton>
        </Tooltip>
    )
}

export default PreviewButton
