import React, {useCallback, useState} from 'react'
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useEffectOnce, useInterval} from 'usehooks-ts'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'

function VersionChecker() {
    if (import.meta.env.DEV) return null
    const [initial, setInitial] = useState()
    const [version, setVersion] = useState()
    const [minVersion, setMinVersion] = useState()
    const [needReload, setNeedReload] = useState(false)

    const checkVersion = async first => {
        try {
            const response = await fetch('/version.json', {cache: 'no-cache'})
            const {version: newVersion} = (await response.json())

            const min = await fetch('/minVersion.json', {cache: 'no-cache'})
            const {minVersion: minVersion} = (await min.json())

            if (first) {
                setInitial(newVersion)
                setMinVersion(minVersion)
            }
            setVersion(newVersion)
            setMinVersion(minVersion)
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

    if (initial && version && minVersion &&  dayjs(initial) < dayjs(version) && dayjs(initial) < dayjs(minVersion)) {
        setTimeout(() => {setNeedReload(true)}, 60000)
    }

     if (needReload) return (
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={true} onClick={null}
        >
            <div style={{
                width: 300,
                padding: 40,
                backgroundColor: '#000',
                textAlign: 'center',
                border: '1px solid #bbb',
                fontWeight: 700
            }}>
                A new version of the site is available.
                Please reload the page to continue.<br/><br/>
                <div>
                    <Button variant='contained' color='secondary' onClick={handleClick} style={{color: '#000'}}>
                        Reload
                    </Button>
                </div>

            </div>
        </Backdrop>
    )

    if (!initial || !version || initial === version) return null

    return (
        <React.Fragment>
            <Tooltip title='New Version Available' arrow disableFocusListener>
                <IconButton onClick={handleClick} style={{color: 'green', marginLeft: 8}}>
                    <SystemUpdateIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export default VersionChecker
