import FileDownloadIcon from '@mui/icons-material/FileDownload'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useState} from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Button from '@mui/material/Button'
import {formatRedditRequest} from './handleRequestSubmit'

export default function ExportRequestTextButton({form, text=false}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])


    const handleCopyReddit = useCallback(() => {
        const clipboardText = formatRedditRequest(form)
        handleClose()
        navigator.clipboard.writeText(clipboardText).then()
        enqueueSnackbar('Belt Request message copied to clipboard.')
    }, [form, handleClose])


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
                <MenuItem onClick={handleCopyReddit}>
                    <ListItemIcon>
                        <ContentCopyIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>Copy Reddit Modmail</ListItemText>
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}