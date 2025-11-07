import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import {useSearchParams} from 'react-router-dom'
import RaffleContext from './RaffleContext.jsx'

function PreviewButton() {
    const {preview, setPreview} = useContext(RaffleContext)
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


    return (
        <Tooltip title='Toggle Preview Mode' arrow disableFocusListener>
            <IconButton onClick={togglePreview} style={{padding: 8}}>
                <VisibilityIcon style={{color: color}} fontSize="small"/>
            </IconButton>
        </Tooltip>
    )
}

export default PreviewButton
