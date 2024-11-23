import React, {useCallback} from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CachedIcon from '@mui/icons-material/Cached'

export default function RafflePreviewBar({refresh}) {

    const refreshPreview = useCallback(async () => {
        const url = window.location.protocol === 'http:'
            ? 'http://explore.lpubelts.com:8080/refresh-preview'
            : 'https://explore.lpubelts.com:8443/refresh-preview'

        const response = await fetch(url, {cache: 'no-store'})
        console.log('preview response', url, await response.json())
        await refresh()
    }, [refresh])

    return (
        <div style={{
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 20,
            padding: 2,
            fontWeight: 700,
            fontSize: '1.2rem',
            backgroundColor: '#900',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div style={{flexGrow: 1, marginLeft: 20}}>PREVIEW MODE</div>
            <Tooltip title={'Refresh From Sheet'} arrow disableFocusListener>
                <IconButton onClick={refreshPreview} style={{marginRight: 10}}>
                    <CachedIcon/>
                </IconButton>
            </Tooltip>
        </div>

    )

}