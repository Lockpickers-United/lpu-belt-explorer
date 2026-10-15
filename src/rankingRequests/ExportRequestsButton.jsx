import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ListIcon from '@mui/icons-material/List'
import CodeIcon from '@mui/icons-material/Code'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useMemo, useState} from 'react'
import entryName from '../entries/entryName'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import download from '../util/download'
import Button from '@mui/material/Button'

export function getExportData(entry) {
    return {
        id: entry.id,
        belt: entry.belt ?? '',
        make: entry.makeModels.map(e => e.make).join(','),
        model: entry.makeModels.map(e => e.model).join(','),
        lockingMechanism: entry.lockingMechanisms[0],
        requestedBy: entry.requestedBy[0].discordUsername,
        name: entryName(entry),
        dateRequested: entry.dateRequested,
        requestStatus: entry.requestStatus
    }
}

export function getMediaData(entry) {
    return entry.media?.map(media => ({
        id: entry.id,
        label: media.label,
        sequenceId: media.sequenceId,
        imageTitle: entryName(entry),
        title: media.title,
        subtitle: media.subtitle,
        subtitleUrl: media.subtitleUrl,
        thumbnailUrl: media.thumbnailUrl,
        fullUrl: media.fullUrl,
        max: '',
        fullSizeUrl: media.fullSizeUrl
    })) ?? []
}

function ExportRequestsButton({text, entries}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const exportEntries = useMemo(() => {
        return Array.isArray(entries) ? entries.slice() : []
    }, [entries])

    const data = exportEntries.map(entry => getExportData(entry))

    // Unique ID	Label	Sequence ID	Image Title	Title	Subtitle	Subtitle URL	Thumbnail URL	Full URL	max	Full Image Direct URL
    const mediaData = exportEntries.reduce((acc, entry) => {
        acc.push(...getMediaData(entry))
        return acc
    }, [])

    const handleExportJson = useCallback(() => {
        const data = JSON.stringify(exportEntries)
        handleClose()
        download('lockrequestdata.json', data)
        enqueueSnackbar('Current lock requests downloaded as lockrequestdata.json')
    }, [handleClose, exportEntries])

    const handleExportClipboard = useCallback(() => {
        const mechanisms = {
            'Dimple': 'D',
            'Disc detainer': 'DD',
            'Lever': 'LL',
            'Magnet': 'M',
            'Other': 'O',
            'Pin-tumbler': 'PT',
            'Slider': 'S',
            'Wafer': 'W'
        }
        const clipboardText = data.map(entry => {
            const safeName = entry.name.replace(/[\s/]/g, '_').replace(/\W/g, '')
            const mech = mechanisms[entry.lockingMechanism] ? `\t${mechanisms[entry.lockingMechanism]}` : ''
            const requestStatus = entry.requestStatus && entry.belt
                ? `\t${entry.requestStatus} (${entry.belt})`
                : entry.requestStatus && entry.requestStatus !== 'Submitted'
                    ? `\t${entry.requestStatus}`
                    : '\t'
            return `${entry.name}${requestStatus}\thttps://lpubelts.com/#/rankingrequests/view?id=${entry.id}&name=${safeName}${mech}`
        }).join('\n')

        handleClose()
        navigator.clipboard.writeText(clipboardText).then()
        enqueueSnackbar('Current lock entries copied to clipboard.')
    }, [data, handleClose])

    const handleExportCsv = useCallback(() => {
        const csvColumns = ['id', 'belt', 'make', 'model', 'version', 'lockingMechanism']
        const headers = csvColumns.join(',')
        const csvData = data.map(entry => {
            return csvColumns
                .map(header => entry[header])
                .map(value => {
                    const newValue = `${value ?? ''}`.replace(/"/g, '""')
                    return /([\s,"])/.test(newValue) ? `"${newValue}"` : newValue
                })
                .join(',')
        }).join('\n')
        const csvFile = `${headers}\n${csvData}`
        handleClose()
        download('lockrequestdata.csv', csvFile)
        enqueueSnackbar('Current lock requests downloaded as lockrequestdata.csv')
    }, [data, handleClose])

    const handleExportMediaCsv = useCallback(() => {
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

        const headers = csvColumns.join(',')
        const csvData = mediaData.map(entry => {
            return csvColumns
                .map(header => entry[header])
                .map(value => {
                    const newValue = `${value ?? ''}`.replace(/"/g, '""')
                    return /([\s,"])/.test(newValue) ? `"${newValue}"` : newValue
                })
                .join(',')
        }).join('\n')
        const csvFile = `${headers}\n${csvData}`
        handleClose()
        download('lockrequestmedia.csv', csvFile)
        enqueueSnackbar('Current lock requests downloaded as lockrequestmedia.csv')
    }, [handleClose, mediaData])

    return (
        <React.Fragment>
            {text
                ? <Tooltip title='Export' arrow disableFocusListener>
                    <Button variant='outlined' size='small' onClick={handleOpen}
                            style={{color: '#ddd', borderColor: '#aaa'}} startIcon={<FileDownloadIcon/>}>
                        Export
                    </Button>
                </Tooltip>
                : <Tooltip title='Export' arrow disableFocusListener>
                    <IconButton onClick={handleOpen}>
                        <FileDownloadIcon/>
                    </IconButton>
                </Tooltip>
            }
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {!text &&
                    <MenuItem disabled>
                        <ListItemIcon>
                            <FileDownloadIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Export</ListItemText>
                    </MenuItem>
                }
                <MenuItem onClick={handleExportClipboard}>
                    <ListItemIcon>
                        <ContentCopyIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>Copy to clipboard</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportCsv}>
                    <ListItemIcon>
                        <ListIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>CSV (entry data)</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportMediaCsv}>
                    <ListItemIcon>
                        <ListIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>CSV (media data)</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportJson}>
                    <ListItemIcon>
                        <CodeIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>JSON</ListItemText>
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}

export default ExportRequestsButton
