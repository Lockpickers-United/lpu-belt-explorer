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
import React, {useCallback, useContext, useState} from 'react'
import DataContext from './ProjectsDataProvider'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import download from '../util/download'
import Button from '@mui/material/Button'

function ProjectsExportButton({text, entries}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {visibleEntries} = useContext(DataContext)

    const exportEntries = entries || visibleEntries

    const handleExportJson = useCallback(() => {
        const data = JSON.stringify(exportEntries)
        handleClose()
        download('lpuProjectsData.json', data)
        enqueueSnackbar('Projects downloaded as lpuProjectsData.json')
    }, [handleClose, exportEntries])

    const handleExportClipboard = useCallback(() => {
        const data = exportEntries.map(datum => ({
            picker: datum.pickerName,
            discipline: datum.discipline,
            tier: datum.tierName,
            date: datum.date,
            source: datum.source,
            evidence: datum.evidenceUrl,
        }))

        const clipboardText = data.map(datum => {
            return `*  ${datum.picker} - ${datum.discipline}, ${datum.tier} (${datum.date})`
        }).join('\n')

        handleClose()
        navigator.clipboard.writeText(clipboardText).then()
        enqueueSnackbar('Projects copied to clipboard.')
    }, [handleClose, exportEntries])

    const handleExportCsv = useCallback(() => {
        const csvColumns = ['picker', 'discipline', 'tier', 'date', 'source', 'evidence']
        const data = exportEntries.map(datum => ({
            picker: datum.pickerName,
            discipline: datum.discipline,
            tier: datum.tierName,
            date: datum.date,
            source: datum.source,
            evidence: datum.evidenceUrl,
        }))

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
        download('lpuProjectsData.csv', csvFile)
        enqueueSnackbar('Projects downloaded as lpuProjectsData.csv')
    }, [handleClose, exportEntries])

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

export default ProjectsExportButton
