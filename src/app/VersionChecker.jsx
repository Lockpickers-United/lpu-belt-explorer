import React, {useCallback, useState} from 'react'
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useEffectOnce, useInterval} from 'usehooks-ts'

function VersionChecker() {
    if (import.meta.env.DEV) return null
    const [initial, setInitial] = useState()
    const [version, setVersion] = useState()

    const checkVersion = async first => {
        try {
            const response = await fetch('./version.json', {cache: 'no-cache'})
            const {version: newVersion} = (await response.json())
            if (first) {
                setInitial(newVersion)
            }
            setVersion(newVersion)
        } catch (e) {
            console.warn('Unable to check version.', e)
            setVersion('error')
        }
    }

    useEffectOnce(() => {
        checkVersion(true)
    })
    useInterval(checkVersion, 10 * 60 * 1000) // 10 minutes

    const handleClick = useCallback(() => location.reload(), [])

    if (!initial || !version || initial === version) return null
    return (
        <Tooltip title='New Version Available' arrow disableFocusListener>
            <IconButton onClick={handleClick} style={{color: 'green', marginLeft: 8}}>
                <SystemUpdateIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default VersionChecker
