import React from 'react'
import Dialog from '@mui/material/Dialog'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'

export default function DisplayDialog({dialogContent, open, handleClose}) {
    return (
        <Dialog open={open} onClose={handleClose} sx={{
            '.MuiDialog-paper': {
                backgroundColor: 'transparent', backgroundImage: 'none', padding: 20, marginBottom: 20
            }
        }}>
            <div style={{
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'flex-end',
                marginBottom: -15,
                marginRight: -10
            }}>
                <IconButton style={{padding: 0, color: '#eee', backgroundColor: '#333'}}
                            onClick={handleClose}>
                    <CancelIcon/>
                </IconButton>
            </div>
            <div style={{
                backgroundColor: '#666',
                borderRadius: 4,
                boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
            }}>
                {dialogContent}
            </div>
        </Dialog>
    )
}
