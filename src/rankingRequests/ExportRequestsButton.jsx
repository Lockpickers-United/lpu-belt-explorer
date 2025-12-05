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

function ExportRequestsButton({text, entries}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const exportEntries = useMemo(() => {
        return Array.isArray(entries) ? entries.slice() : []
    }, [entries])

    const data = exportEntries.map(datum => ({
        id: datum.id,
        make: datum.makeModels.map(e => e.make).join(','),
        model: datum.makeModels.map(e => e.model).join(','),
        lockingMechanism: datum.lockingMechanisms[0],
        requestedBy: datum.requestedBy[0].discordUsername,
        name: entryName(datum),
        dateRequested: datum.dateRequested
    }))

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

        const clipboardText = data.map(datum => {
            const safeName = datum.name.replace(/[\s/]/g, '_').replace(/\W/g, '')
            const mech = mechanisms[datum.lockingMechanism] ? `\t${mechanisms[datum.lockingMechanism]}` : ''
            return `${datum.name}\t\thttps://lpubelts.com/#/rankingrequests/view?id=${datum.id}&name=${safeName}${mech}`
        }).join('\n')

        handleClose()
        navigator.clipboard.writeText(clipboardText).then()
        enqueueSnackbar('Current lock entries copied to clipboard.')
    }, [data, handleClose])

    const handleExportCsv = useCallback(() => {
        const csvColumns = ['id', 'name', 'lockingMechanism', 'requestedBy', 'dateRequested']
        const headers = csvColumns.join(',')
        const csvData = data.map(datum => {
            return csvColumns
                .map(header => datum[header])
                .map(value => {
                    const newValue = `${value ?? ''}`.replace(/"/g, '""')
                    return /(\s|,|")/.test(newValue) ? `"${newValue}"` : newValue
                })
                .join(',')
        }).join('\n')
        const csvFile = `${headers}\n${csvData}`
        handleClose()
        download('lockrequestdata.csv', csvFile)
        enqueueSnackbar('Current lock requests downloaded as lockrequestdata.csv')
    }, [data, handleClose])

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
                    <ListItemText>CSV</ListItemText>
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
