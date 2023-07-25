import React, {useCallback, useEffect, useState} from 'react'
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import dayjs from 'dayjs'

function VersionChecker() {
    if (import.meta.env.DEV) return null
    const [checkTime, setCheckTime] = useState(dayjs())
    const [currentVersion, setCurrentVersion] = useState(null)
    const [nextVersion, setNextVersion] = useState(null)

    const loadVersion = useCallback(async initial => {
        try {
            const response = await fetch('./version.json', {cache: 'no-cache'})
            const {version} = (await response.json())
            if (initial) setCurrentVersion(version)
            setNextVersion(version)
            setCheckTime(dayjs())
        } catch (e) {
            console.warn('Unable to check version.', e)
        }
    }, [])

    useEffect(() => {
        // Initial load
        if (!currentVersion) {
            loadVersion(true)
        }

        // Timer for checking later
        const duration = 10 * 60 * 1000 // 10 minutes
        let intervalId = setInterval(() => {
            const now = dayjs()
            // Only check the version 60 minutes after last check
            const shouldCheckTime = checkTime.add(60, 'minutes')
            if (now.isAfter(shouldCheckTime)) {
                loadVersion()
            }
        }, duration)

        // Clean up timer
        return () => clearInterval(intervalId)
    }, [checkTime, currentVersion, loadVersion])

    const handleClick = useCallback(() => {
        location.reload()
    }, [])

    if (!currentVersion || !nextVersion || currentVersion === nextVersion) return null
    return (
        <Tooltip title='New Version Available' arrow disableFocusListener>
            <IconButton onClick={handleClick} style={{color: 'green'}}>
                <SystemUpdateIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default VersionChecker
