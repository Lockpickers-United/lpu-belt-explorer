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
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import download from '../util/download'
import DataContext from '../context/DataContext.jsx'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import RaffleContext from './RaffleContext.jsx'


function RaffleExportButton({text}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const dateText = dayjs().format('YYYY-MM-DD')
    const {raffleAdminRole} = useContext(RaffleContext)
    const {visibleEntries = []} = useContext(DataContext)

    const handleExportJson = useCallback(() => {
        const data = JSON.stringify(visibleEntries)
        handleClose()
        download(`rafflePots${dateText}.json`, data)
        enqueueSnackbar('Current RAFL entries downloaded as rafflePots.json')
    }, [dateText, handleClose, visibleEntries])

    const handleExportClipboard = useCallback(() => {
        const data = visibleEntries.map(entry => ({
            id: entry.id,
            potNumber: entry.potNumber,
            title: entry.title,
            contributedBy: entry.contributedBy,
            donors: entry.donors,
            tickets: entry.tickets,
            winner: entry.winner
        }))

        const clipboardText = data.map(entry => {
            const winnerText = entry.winner ? `[Winner: ${entry.winner}]` : ''
            return `* Pot #${entry.potNumber} - ${entry.title} ${winnerText}`
        }).join('\n')

        handleClose()
        navigator.clipboard.writeText(clipboardText).then(() => {
            enqueueSnackbar('Current scorecard entries copied to clipboard.')
        })
    }, [handleClose, visibleEntries])

    const handleExportCsv = useCallback(() => {
        const data = visibleEntries.map(entry => ({
            potNumber: entry.potNumber,
            title: entry.title,
            //id: entry.id,
            contributedBy: entry.contributedBy,
            donors: entry.donors,
            tickets: entry.tickets,
            winner: entry.winner
        }))

        const headers = Object.keys(data[0]).join(',')
        const csvData = data.map(datum => {
            return Object.keys(data[0])
                .map(header => datum[header])
                .map(value => {
                    const newValue = `${value ?? ''}`.replace(/"/g, '""')
                    return /(\s|,|")/.test(newValue) ? `"${newValue}"` : newValue
                })
                .join(',')
        }).join('\n')
        const csvFile = `${headers}\n${csvData}`
        handleClose()
        download('scorecardData.csv', csvFile)
        enqueueSnackbar('Current Scorecard entries downloaded as scorecardData.csv')
    }, [handleClose, visibleEntries])

    return (
        <div>
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
                {raffleAdminRole &&
                    <MenuItem onClick={handleExportJson}>
                        <ListItemIcon>
                            <CodeIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>JSON</ListItemText>
                    </MenuItem>
                }
            </Menu>
        </div>
    )
}

export default RaffleExportButton
