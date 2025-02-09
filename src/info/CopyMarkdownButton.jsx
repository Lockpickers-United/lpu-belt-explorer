import FileDownloadIcon from '@mui/icons-material/FileDownload'
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

function CopyMarkdownButton({content}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const text= true
    const handleExportClipboard = useCallback(() => {
        handleClose()
        navigator.clipboard.writeText(content).then()
        enqueueSnackbar('Belt Requirements markdown copied to clipboard.')
    }, [content, handleClose])

    const handleExportMarkdown = useCallback(() => {
        handleClose()
        download('beltRequirements.md', content)
        enqueueSnackbar('Belt Requirements markdown downloaded as beltRequirements.md')
    }, [content, handleClose])

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
                <MenuItem onClick={handleExportMarkdown}>
                    <ListItemIcon>
                        <CodeIcon fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText>Save to file</ListItemText>
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}

export default CopyMarkdownButton
