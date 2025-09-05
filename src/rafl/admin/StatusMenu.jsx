import React, {useCallback, useContext} from 'react'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Menu from '@mui/material/Menu'
import Dialog from '@mui/material/Dialog'
import DBContext from '../../app/DBContext.jsx'
import dayjs from 'dayjs'

export default function StatusMenu({entry}) {

    const {updateRaffleEntry, deleteRaffleEntry} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => { // eslint-disable-line no-unused-vars
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const changeStatus = useCallback(status => {
        if (!status || status===entry.status) return
        const updatedEntry = {...entry, status}
        if (status==='approved') {
            updatedEntry.approvedAt = dayjs().toISOString()
        } else if  (status==='rejected') {
            updatedEntry.rejectedAt = dayjs().toISOString()
        }
        updateRaffleEntry(updatedEntry)
            .then(() => {
                console.log('Entry status updated to', status)
            })
            .catch(error => {
                console.error('Error updating entry status:', error)
            })
        handleClose()
    },[entry, updateRaffleEntry])

    const pending = entry.status==='pending'
    const approved = entry.status==='approved'
    const issues = entry.status==='issues'
    const rejected = entry.status==='rejected'

    const [deleteOpen, setDeleteOpen] = React.useState(false)
    const handleDeleteClose = () => {
        setDeleteOpen(false)
    }

    return (
        <React.Fragment>
            <Tooltip title='Change Entry Status' arrow disableFocusListener>
                <Button variant='contained' size='small' color='warning'
                        onClick={handleClick}
                        style={{
                            backgroundColor: '#50af3e', marginRight: 20
                        }}>
                        CHANGE STATUS
                </Button>
            </Tooltip>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
            >

                <Stack direction='column' style={{minWidth: 100}}>
                    <MenuItem style={{color: pending ? '#fff' : '#f1aa55'}} onClick={() => changeStatus('pending')} disabled={pending}>
                        Pending
                    </MenuItem>
                    <MenuItem style={{color: approved ? '#fff' : '#f1aa55'}} onClick={() => changeStatus('approved')} disabled={approved}>
                        Approved
                    </MenuItem>
                    <MenuItem style={{color: issues ? '#fff' : '#f1aa55'}} onClick={() => changeStatus('issues')} disabled={issues}>
                        Issues
                    </MenuItem>
                    <MenuItem style={{color: rejected ? '#fff' : '#f1aa55'}} onClick={() => changeStatus('rejected')} disabled={rejected}>
                        Rejected
                    </MenuItem>
                    <MenuItem style={{color: '#f00'}} onClick={() => setDeleteOpen(true)}>
                        Delete
                    </MenuItem>
                </Stack>
            </Menu>

            <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                <div style={{padding: 20, textAlign: 'center'}}>
                    You cannot undo delete.<br/>
                    Are you sure?
                </div>
                <div style={{textAlign: 'center'}}>
                    <Button style={{marginBottom: 10, color: '#000'}}
                            variant='contained'
                            onClick={() => deleteRaffleEntry(entry).then(() => setDeleteOpen(false))}
                            edge='start'
                            color='error'
                    >
                        Delete
                    </Button>
                </div>
            </Dialog>

        </React.Fragment>
    )}
