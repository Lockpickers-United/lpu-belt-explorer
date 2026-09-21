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
import React, {useCallback, useState} from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import download from '../util/download'
import Button from '@mui/material/Button'
import {json2csv} from 'json-2-csv'

export default function ExportButtonGeneric({exportData}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const {
        data = [],
        csvHeaders = [],
        clipboardHeaders,
        clipboardFormat,
        filename = 'export',
        textButton = false,
        formats = ['clipboard', 'csv', 'json']
    } = exportData

    const handleExportJson = useCallback(() => {
        const jsonData = JSON.stringify(data)
        handleClose()
        download(filename + '.json', jsonData)
        enqueueSnackbar(`Export downloaded as ${filename}.json`)
    }, [data, filename, handleClose])


    const handleExportClipboard = useCallback(() => {
        const exportHeaders = clipboardHeaders || csvHeaders

        const headerRow = exportHeaders?.reduce((acc, col) => {
            Object.keys(col).forEach(key => {
                acc[key] = col[key].trim().toUpperCase()
            })
            return acc
        }, {})

        const clipboardData = data.map(row => {
            return clipboardFormat
                ? clipboardFormat(row, exportHeaders)
                : exportHeaders.reduce((acc, header) => {
                    Object.keys(header).forEach(key => {
                        acc += row[key].trim() + ' | '
                    })
                    return acc
                }, '')
        })
        handleClose()

        const clipboardText = clipboardFormat(headerRow, exportHeaders) + '\n' + clipboardData.join('\n')
        navigator.clipboard.writeText(clipboardText).then()
        enqueueSnackbar('Export copied to clipboard.')
    }, [clipboardFormat, clipboardHeaders, csvHeaders, data, handleClose])

    const handleExportCsv = useCallback(() => {
        const csvData = data.map(datum => {
            return csvHeaders.reduce((acc, header) => {
                Object.entries(header).forEach(([key, value]) => {
                    acc[value] = datum[key].trim()
                })
                return acc
            }, {})
        })
        handleClose()
        download(`${filename}.csv`, json2csv(csvData))
        enqueueSnackbar(`Export downloaded as ${filename}.csv`)
    }, [csvHeaders, data, filename, handleClose])

    return (
        <React.Fragment>
            {textButton
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
                {!textButton &&
                    <MenuItem disabled>
                        <ListItemIcon>
                            <FileDownloadIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Export</ListItemText>
                    </MenuItem>
                }
                {formats.includes('clipboard') &&
                    <MenuItem onClick={handleExportClipboard}>
                        <ListItemIcon>
                            <ContentCopyIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Copy to clipboard</ListItemText>
                    </MenuItem>
                }
                {formats.includes('csv') &&
                    <MenuItem onClick={handleExportCsv}>
                        <ListItemIcon>
                            <ListIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>CSV</ListItemText>
                    </MenuItem>
                }
                {formats.includes('json') &&
                    <MenuItem onClick={handleExportJson}>
                        <ListItemIcon>
                            <CodeIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>JSON</ListItemText>
                    </MenuItem>
                }
            </Menu>
        </React.Fragment>
    )
}