import FileDownloadIcon from '@mui/icons-material/FileDownload'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback} from 'react'
import Button from '@mui/material/Button'
import downloadAndZip from '../util/downloadAndZip'
import {enqueueSnackbar} from 'notistack'

export default function DownloadZipButton({fileData, textButton = false, color = 'info'}) {

    const handleDownload = useCallback(() => {
        const success = downloadAndZip(fileData)
        const archiveName = fileData[0].dirname
        enqueueSnackbar(success ? `Export downloaded as ${archiveName}.zip` : 'Export download failed')
    }, [fileData])

    if (!Array.isArray(fileData) || !fileData.length) {
        console.error('No files to download',)
        return
    }

    return (
        <React.Fragment>
            {textButton
                ? <Tooltip title='Download Zip' arrow disableFocusListener>
                    <Button variant='outlined' size='small' onClick={handleDownload} color={color}
                            style={{}} startIcon={<FileDownloadIcon color={color}/>}>
                        Download Zip
                    </Button>
                </Tooltip>
                : <Tooltip title='Download Zip' arrow disableFocusListener>
                    <IconButton onClick={handleDownload} color={color}>
                        <FileDownloadIcon/>
                    </IconButton>
                </Tooltip>
            }
        </React.Fragment>
    )
}