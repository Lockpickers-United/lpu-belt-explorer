import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ListIcon from '@mui/icons-material/List'
import CodeIcon from '@mui/icons-material/Code'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext, useState} from 'react'
import DataContext from '../contexts/DataContext'
import EntryName from '../entries/EntryName.js'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

function ExportButton() {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {visibleEntries} = useContext(DataContext)

    const download = useCallback((filename, data) => {
        const element = document.createElement('a')
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data))
        element.setAttribute('download', filename)

        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }, [])

    const handleExportJson = useCallback(() => {
        const data = JSON.stringify(visibleEntries)
        handleClose()
        return download('lpubeltsdata.json', data)
    }, [handleClose,download, visibleEntries])

    const handleExportClipboard = useCallback(() => {
        const copyToClipboard = async (clipboardText) => {
            await navigator.clipboard.writeText(clipboardText)
        }

        const data = visibleEntries.map(datum => ({
            id: datum.id,
            make: datum.makeModels.map(e => e.make).join(','),
            model: datum.makeModels.map(e => e.model).join(','),
            version: datum.version,
            belt: datum.belt,
            name: EntryName(datum),
            versionText: datum.version ? ' (' + datum.version + ')' : ''
        }))

        const clipboardText = data.map(datum => {
            return '* ' + datum.name + datum.versionText
        }).join('\n')

        handleClose()
        return copyToClipboard(clipboardText)
    }, [handleClose,visibleEntries])

    const handleExportCsv = useCallback(() => {
        const csvColumns = ['id', 'name', 'version', 'belt']
        const data = visibleEntries.map(datum => ({
            id: datum.id,
            make: datum.makeModels.map(e => e.make).join(','),
            model: datum.makeModels.map(e => e.model).join(','),
            version: datum.version,
            belt: datum.belt,
            name: EntryName(datum)
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
        return download('lpubeltsdata.csv', csvFile)
    }, [handleClose,download, visibleEntries])

    return (
        <React.Fragment>
            <Tooltip title='Export' arrow disableFocusListener>
                <IconButton onClick={handleOpen}>
                    <FileDownloadIcon/>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem disabled>
                    <ListItemIcon>
                        <FileDownloadIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>Export</ListItemText>
                </MenuItem>
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

export default ExportButton