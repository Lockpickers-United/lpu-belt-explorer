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
import download from '../../util/download'
import DataContext from '../../context/DataContext.jsx'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import RaffleContext from '../RaffleContext.jsx'

export default function RaffleAdminExportButton({text}) {
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
        download(`raffleEntries${dateText}.json`, data)
        enqueueSnackbar('Current RAFL entries downloaded as raffleEntries.json')
    }, [dateText, handleClose, visibleEntries])

    const handleExportClipboard = useCallback(() => {
        const data = visibleEntries.map(entry => {
            const wonPots = entry.pots
                .filter(pot => entry.potsWon.includes(pot.itemId))
                .map(pot => pot.itemTitle)
            return {
                id: entry.id,
                username: entry.username,
                platform: entry.platform,
                createdAt: entry.createdAt,
                potNames: entry.potNames.join(', '),
                donations: entry.donations.map(donation => donation.charity.itemTitle).join(', '),
                totalDonation: entry.totalDonation,
                wonPots: wonPots.join(', ')
            }
        })

        const clipboardText = data.map(entry => {
            let entryText = `${entry.username} (${entry.platform}) - $${entry.totalDonation}\n` +
                `  POTS: ${entry.potNames}\n` +
                `  DONATIONS: ${entry.donations}\n`
            if (entry.wonPots.length > 0) entryText += `  POTS WON: ${entry.wonPots}\n`
            return entryText
        }).join('\n')

        handleClose()
        navigator.clipboard.writeText(clipboardText).then(() => {
            enqueueSnackbar('Current RAFL entries copied to clipboard.')
        })
    }, [handleClose, visibleEntries])

    const handleExportCsv = useCallback(() => {
        const data = visibleEntries.map(entry => {
            const wonPots = entry.pots
                .filter(pot => entry.potsWon.includes(pot.itemId))
                .map(pot => pot.itemTitle)
            return {
                id: entry.id,
                username: entry.username,
                platform: entry.platform,
                totalDonation: `$${entry.totalDonation}`,
                createdAt: dayjs(entry.createdAt).format('MM-DD-YYYY'),
                potNames: entry.potNames.join(', '),
                donations: entry.donations.map(donation => donation.charity.itemTitle).join(', '),
                wonPots: wonPots.join(', ')
            }
        })

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
        download('raffleEntries.csv', csvFile)
        enqueueSnackbar('Current RAFL entries downloaded as raffleEntries.csv')
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
