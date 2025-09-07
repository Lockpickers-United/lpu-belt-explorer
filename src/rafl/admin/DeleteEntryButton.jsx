import React, {useCallback, useContext, useState} from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import DBContext from '../../app/DBContext.jsx'
import DisplayDialog from '../../misc/DisplayDialog.jsx'

export default function DeleteEntryButton({entry}) {

    const {deleteRaffleEntry} = useContext(DBContext)

    const [deleteOpen, setDeleteOpen] = useState(false)
    const handleDeleteClose = useCallback(() => {
        setDeleteOpen(false)
    },[])

    const dialogContent = (
        <div style={{textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', padding: 40}}>
            You cannot undo delete.<br/>
            Are you sure?<br/><br/>
            <Button style={{marginBottom: 10, color: '#111'}}
                    variant='contained'
                    onClick={() => deleteRaffleEntry(entry).then(() => setDeleteOpen(false))}
                    edge='start'
                    color='error'
            >
                Delete
            </Button>
        </div>
    )

    return (
        <React.Fragment>
            <Tooltip title='Change Entry Status' arrow disableFocusListener>
                <Button variant='text' size='small'
                        onClick={() => setDeleteOpen(true)}
                        style={{
                            color: '#e50808', margin: '0px 0px 0px 15px'
                        }}>
                    Delete Entry
                </Button>
            </Tooltip>

            <DisplayDialog dialogContent={dialogContent} open={deleteOpen} handleClose={handleDeleteClose} />

        </React.Fragment>
    )
}
