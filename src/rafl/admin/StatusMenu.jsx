import React, {useCallback, useContext} from 'react'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Menu from '@mui/material/Menu'
import Dialog from '@mui/material/Dialog'
import DBContext from '../../app/DBContext.jsx'
import dayjs from 'dayjs'
import EditIcon from '@mui/icons-material/Edit'
import DataContext from '../../context/DataContext.jsx'

export default function StatusMenu({entry}) {

    const {updateRaffleEntry, deleteRaffleEntry} = useContext(DBContext)
    const {statusLabels} = useContext(DataContext)

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
                //console.log('Entry status updated to', status)
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
                <Button variant='contained' size='small' endIcon={<EditIcon />}
                onClick={handleClick}
                        style={{
                            backgroundColor: statusLabels[entry.status].backgroundColor, marginRight: 0
                        }}>
                    {entry.status}
                </Button>
            </Tooltip>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
            >

                <Stack direction='column' style={{minWidth: 100}}>
                    <MenuItem style={{color: pending ? '#fff' : statusLabels['pending'].backgroundColor}} onClick={() => changeStatus('pending')} disabled={pending}>
                        Pending
                    </MenuItem>
                    <MenuItem style={{color: approved ? '#fff' : statusLabels['approved'].backgroundColor}} onClick={() => changeStatus('approved')} disabled={approved}>
                        Approved
                    </MenuItem>
                    <MenuItem style={{color: issues ? '#fff' : statusLabels['issues'].backgroundColor}} onClick={() => changeStatus('issues')} disabled={issues}>
                        Issues
                    </MenuItem>
                    <MenuItem style={{color: rejected ? '#fff' : statusLabels['rejected'].backgroundColor}} onClick={() => changeStatus('rejected')} disabled={rejected}>
                        Rejected
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
