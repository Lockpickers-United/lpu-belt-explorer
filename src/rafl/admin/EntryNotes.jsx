import useWindowSize from '../../util/useWindowSize.jsx'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DBContext from '../../app/DBContext.jsx'
import ScopedDialog from '../../misc/ScopedDialog.jsx'
import Box from '@mui/material/Box'

export default function EntryNotes({entry, containerRef}) {
    const {updateRaffleEntry} = useContext(DBContext)

    const [notesOpen, setNotesOpen] = useState(false)
    const handleNotesOpen = useCallback(() => {
        setNotesOpen(true)
    }, [])
    const handleNotesClose = useCallback(() => {
        setNotesOpen(false)
        setInputValue(entry.notes || '')
    }, [entry.notes])

    const [inputValue, setInputValue] = useState(entry.notes || '')

    useEffect(() => {
        setInputValue(entry.notes || '')
    }, [entry.notes])

    const handleChange = (event) => {
        setInputValue(event.target.value)
    }

    const saveNotes = useCallback(() => {
        const updatedEntry = {
            ...entry,
            notes: inputValue || ''
        }
        updateRaffleEntry(updatedEntry, false)
            .then(() => {
                console.log('Notes updated successfully')
            })
            .catch(error => {
                console.error('Error updating notes:', error)
            })
        handleNotesClose()
    }, [entry, handleNotesClose, inputValue, updateRaffleEntry])

    const removeNotes = useCallback(() => {
        const updatedEntry = {
            ...entry,
            notes: ''
        }
        updateRaffleEntry(updatedEntry, false)
            .then(() => {
                //console.log('Notes removed successfully')
            })
            .catch(error => {
                console.error('Error removing notes:', error)
            })
        handleNotesClose()
    }, [entry, handleNotesClose, updateRaffleEntry])

    const {isMobile} = useWindowSize()
    const optionalHeaderStyle = {fontSize: '1.0rem', fontWeight: 400, marginBottom: 5, paddingLeft: 2, color: '#fff'}
    const contentsFontSize = isMobile ? '0.95rem' : '1.0rem'

    const dialogContent = (
        <div style={{display: 'flex'}}>
            <div style={{flexGrow: 1, maxWidth: 550, padding: 10}}>
                <div style={{marginTop: 10, display: 'flex'}}>
                    <div style={{...optionalHeaderStyle, flexGrow: 1, fontWeight: 700}}>
                        Entry Notes
                    </div>
                    <div style={{...optionalHeaderStyle, color: '#aaa', fontSize: '0.85rem'}}>
                        {inputValue.length || 0}/1200
                    </div>
                </div>
                <TextField type='text' name='notes' multiline fullWidth rows={3}
                           value={inputValue} onChange={handleChange}
                           id='notes'
                           color='info' style={{}}
                           placeholder='Add additional notes about this entry'
                           variant='outlined'
                           autoFocus
                           InputProps={{style: {fontSize: contentsFontSize}}}
                           slotProps={{
                               htmlInput: {maxLength: 1200}
                           }}
                />
                <div style={{flexGrow: 1, textAlign: 'right', marginTop: 8}}>
                    <Button variant='text' size='small' onClick={handleNotesClose}>Cancel</Button>
                    <Button variant='text' size='small' onClick={saveNotes} color='success'>Save</Button>
                </div>
            </div>
        </div>
    )


    return (
        <Box sx={{
            position: 'relative',
            overflow: 'hidden',
            isolation: 'isolate'
        }}>

            {entry.notes?.length > 0
                ? <div style={{fontWeight: 700, marginTop: 15}}>
                    <div style={{display: 'flex'}}>
                        <span style={{marginTop: -0.6}}>Notes &nbsp;</span>
                        <Link style={{fontWeight: 400, color: '#2bb259'}} onClick={handleNotesOpen}>edit</Link>
                        &nbsp;•&nbsp;
                        <Link style={{fontWeight: 400, color: '#2bb259'}} onClick={removeNotes}>remove</Link>
                    </div>
                    <div style={{
                        fontSize: contentsFontSize,
                        marginLeft: 10,
                        fontWeight: 400,
                        fontStyle: 'italic'
                    }}>{entry.notes}</div>
                </div>

                : <div style={{fontWeight: 700, marginTop: 15}}>
                    <Link style={{fontWeight: 600, color: '#2bb259'}} onClick={handleNotesOpen}>Add notes</Link>
                </div>
            }

            <ScopedDialog
                open={notesOpen}
                dialogContent={dialogContent}
                handleClose={handleNotesClose}
                containerRef={containerRef}
                position={{top: 80}}
                centerX={true}
                width={isMobile ? 350 : 550}
            />


        </Box>
    )

}