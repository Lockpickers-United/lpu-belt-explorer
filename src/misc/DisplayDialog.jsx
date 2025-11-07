import React from 'react'
import Dialog from '@mui/material/Dialog'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import {Zoom} from '@mui/material'

// <DisplayDialog dialogContent={dialogContent} open={showDialog} handleClose={handleDialogClose} width={400}/>

export default function DisplayDialog({dialogContent, open, handleClose, width = 350, dark=true}) {

    const stopClick = (e) => {
        e.stopPropagation()
        e.preventDefault()
    }

    return (
        <Dialog open={open} onClose={handleClose}
                sx={{
                    '.MuiDialog-paper': {
                        backgroundColor: 'transparent', backgroundImage: 'none',
                        padding: '12px', margin: '0px 0px 20px 0px',
                        width: width
                    },
                    '& .MuiBackdrop-root': {
                        backgroundColor: dark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: dark ? 'blur(0.75px)' : 'none'
                    },

                }}>

            <Zoom in={open} timeout={{enter: 250, exit: 250}}>
                <div>
                    {handleClose &&
                        <div onClick={handleClose} style={{
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
                    }
                    <div onClick={stopClick} style={{
                        backgroundColor: '#666',
                        borderRadius: 4,
                        //boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
                        boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.4),0px 24px 38px 3px rgba(0,0,0,0.28),0px 9px 46px 8px rgba(0,0,0,0.24)'
                    }}>
                        {dialogContent}
                    </div>
                </div>
            </Zoom>
        </Dialog>
    )
}
