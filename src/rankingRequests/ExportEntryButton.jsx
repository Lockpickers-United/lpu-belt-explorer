import FileDownloadIcon from '@mui/icons-material/FileDownload'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import downloadAndZip from '../util/downloadAndZip.js'
import {enqueueSnackbar} from 'notistack'
import {getExportData, getMediaData} from './ExportRequestsButton.jsx'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export default function ExportEntryButton({entry, textButton = false, color = 'info'}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const fileData = useMemo(() => {
        return entry.media
            ? entry.media?.map?.(file => {
                const filename = new URL(file.fullUrl).pathname.split('/').pop()
                const parts = new URL(file.fullUrl).pathname.split('/')
                const dirname = parts[parts.indexOf('requestedLocks') + 1]
                return filename.length
                    ? {url: file.fullUrl, name: filename, dirname}
                    : null
            }).filter(file => file)
            : []
    }, [entry])


    const handleExportClipboard = useCallback(() => {
        const exportData = getExportData(entry)
        const columns = ['id', 'belt', 'make', 'model', 'version', 'lockingMechanism']
        const clipboardText = columns.map(column => exportData[column]).join('\t')
        handleClose()
        navigator.clipboard.writeText(clipboardText).then()
        enqueueSnackbar('Current lock entries copied to clipboard.')
    }, [entry, handleClose])

    const handleExportClipboardMedia = useCallback(() => {
        const mediaData = getMediaData(entry)
        const csvColumns = [
            'id',
            'label',
            'sequenceId',
            'imageTitle',
            'title',
            'subtitle',
            'subtitleUrl',
            'thumbnailUrl',
            'fullUrl',
            'max',
            'fullSizeUrl'
        ]

        const clipboardText = mediaData.map(row => csvColumns.map(column => row[column]).join('\t')).join('\n')
        handleClose()
        navigator.clipboard.writeText(clipboardText).then()
        enqueueSnackbar('Current lock entries copied to clipboard.')
    }, [entry, handleClose])


    const handleDownload = useCallback(async () => {
        const success = fileData.length > 0
            ? await downloadAndZip(fileData)
            : false
        const archiveName = fileData[0]?.dirname
        enqueueSnackbar(success ? `Export downloaded as ${archiveName}.zip` : 'Export download failed')
    }, [fileData])

    return (
        <React.Fragment>
            {textButton
                ? <Tooltip title='Export Entry' arrow disableFocusListener>
                    <Button variant='outlined' size='small' onClick={handleOpen} color={color}
                            style={{}} startIcon={<FileDownloadIcon color={color}/>}>
                        Export Entry
                    </Button>
                </Tooltip>
                : <Tooltip title='Export Entry' arrow disableFocusListener>
                    <IconButton onClick={handleOpen} color={color}>
                        <FileDownloadIcon/>
                    </IconButton>
                </Tooltip>
            }
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDownload}>
                    <ListItemIcon>
                        <FileDownloadIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>Download Images</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleExportClipboard}>
                    <ListItemIcon>
                        <ContentCopyIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>Copy to clipboard</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleExportClipboardMedia}>
                    <ListItemIcon>
                        <ContentCopyIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>Copy to media data to clipboard</ListItemText>
                </MenuItem>

            </Menu>
        </React.Fragment>
    )
}