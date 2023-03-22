import React, {useCallback, useEffect, useState} from 'react'
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import dayjs from 'dayjs'

function VersionChecker() {
    const [checkTime, setCheckTime] = useState(dayjs())
    const [currentVersion, setCurrentVersion] = useState(null)
    const [nextVersion, setNextVersion] = useState(null)

    const loadVersion = useCallback(async initial => {
        const response = await fetch('./version.json')
        const {version} = (await response.json())
        if (initial) setCurrentVersion(version)
        setNextVersion(version)
        setCheckTime(dayjs())
    }, [])

    useEffect(() => {
        // Initial load
        if (!currentVersion) {
            loadVersion(true)
        }

        // Timer for checking later
        const timerId = setTimeout(() => {
            const now = dayjs()
            const shouldCheckTime = checkTime.add(1, 'minutes')
            if (now.isAfter(shouldCheckTime)) {
                loadVersion()
            }
        }, 1 * 60 * 1000) // 1 minute

        // Clean up timer
        return () => clearTimeout(timerId)
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
