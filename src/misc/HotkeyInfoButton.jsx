import React, {useState, useCallback} from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import Transition from '../util/Transition'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

function HotkeyInfoButton() {
    const [open, setOpen] = useState(false)
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleClose = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Tooltip title='Hotkeys' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen}>
                    <KeyboardIcon/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                scroll='body'
            >
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge='start'
                            color='inherit'
                            onClick={handleClose}
                            aria-label='close'
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant='h6' component='div'>
                            Hotkey Info
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <List>
                        {hotkeys.map(({key, text}) =>
                            <React.Fragment key={key}>
                                <ListItem>
                                    <ListItemAvatar>{key}</ListItemAvatar>
                                    <ListItemText>{text}</ListItemText>
                                </ListItem>
                            </React.Fragment>
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

const hotkeys = [
    {key: 'H', text: 'Go (H)ome, reset all search and filter criteria.'},
    {key: 'S', text: 'Select (S)earch text box.'},
    {key: 'F', text: 'Open/Close (F)ilter drawer.'},
    {key: '1 - 9', text: 'Select belt tab, 1=white, 2=yellow, etc.'},
    {key: 'I', text: 'Open/Close (I)nfo dialog.'},
    {key: 'R', text: '(R)andom Lock'}
]

export default HotkeyInfoButton
