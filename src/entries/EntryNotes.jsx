import useWindowSize from '../util/useWindowSize.jsx'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import DisplayDialog from '../misc/DisplayDialog.jsx'
import Button from '@mui/material/Button'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import SignInButton from '../auth/SignInButton.jsx'
import sanitizeValues from '../util/sanitizeValues'

export default function EntryNotes({entry}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {userLockNotes, updateProfileField} = useContext(DBContext)

    const entryNotes = userLockNotes[entry.id] || ''

    const handleSaveNotes = useCallback(async (updatedNotes) => {
        await updateProfileField('userLockNotes', updatedNotes)
        setNotesOpen(false)
    }, [updateProfileField])

    const [notesOpen, setNotesOpen] = useState(false)
    const handleNotesOpen = useCallback(() => {
        setNotesOpen(true)
    }, [])
    const handleNotesClose = useCallback(() => {
        setNotesOpen(false)
        setInputValue(entryNotes)
    }, [entryNotes])

    const [inputValue, setInputValue] = useState(entryNotes)

    useEffect(() => {
        setInputValue(entryNotes || '')
    }, [entryNotes])

    const handleChange = (event) => {
        setInputValue(sanitizeValues(event.target.value, {urlsOK: true}))
    }

    const saveNotes = useCallback(async () => {
        const updatedUserLockNotes = {
            ...userLockNotes,
            [entry.id]: inputValue || ''
        }
        await handleSaveNotes(updatedUserLockNotes)
            .catch(error => {
                console.error('Error updating notes:', error)
            })
        handleNotesClose()
    }, [userLockNotes, entry.id, inputValue, handleSaveNotes, handleNotesClose])

    const removeNotes = useCallback(async () => {
        const updatedUserLockNotes = {...userLockNotes}
        delete updatedUserLockNotes[entry.id]
        await handleSaveNotes(updatedUserLockNotes)
            .catch(error => {
                console.error('Error removing notes:', error)
            })
        handleNotesClose()
    }, [entry.id, handleNotesClose, handleSaveNotes, userLockNotes])

    const {isMobile} = useWindowSize()
    const optionalHeaderStyle = {fontSize: '1.0rem', fontWeight: 400, marginBottom: 5, paddingLeft: 2, color: '#fff'}
    const contentsFontSize = isMobile ? '0.95rem' : '1.0rem'
    const notesRows = isMobile ? 5 : 3

    const dialogContent = (
        <div style={{display: 'flex'}}>
            {isLoggedIn
                ? <div style={{flexGrow: 1, maxWidth: 550, padding: 10}}>
                    <div style={{marginTop: 10, display: 'flex'}}>
                        <div style={{...optionalHeaderStyle, flexGrow: 1, fontWeight: 700}}>
                            My Notes
                        </div>
                        <div style={{...optionalHeaderStyle, color: '#aaa', fontSize: '0.85rem'}}>
                            {inputValue.length || 0}/1200
                        </div>
                    </div>
                    <TextField type='text' name='notes' multiline fullWidth rows={notesRows}
                               value={inputValue} onChange={handleChange}
                               id='notes'
                               color='info' style={{}}
                               placeholder='Add additional notes about this entry'
                               variant='outlined'
                               autoFocus
                               inputProps={{ maxLength: 1200, style: { fontSize: contentsFontSize } }}
                    />
                    <div style={{flexGrow: 1, textAlign: 'right', marginTop: 8}}>
                        <Button variant='text' size='small' onClick={handleNotesClose}>Cancel</Button>
                        <Button variant='text' size='small' onClick={saveNotes} color='success'>Save</Button>
                    </div>
                </div>
                : <div style={{flexGrow: 1, padding: '40px 20px', placeItems: 'center'}}>
                    <div style={{...optionalHeaderStyle, marginBottom: 15, fontWeight: 700, textAlign: 'center'}}>
                        Please sign in to add your<br/>
                        own notes for locks.
                    </div>
                    <div style={{width:210}}><SignInButton onClick={handleNotesClose}/></div>
                </div>
            }
        </div>
    )

    return (
        <React.Fragment>
            {entryNotes?.length > 0
                ? <div style={{fontWeight: 700, marginTop: 15}}>
                    <div style={{display: 'flex'}}>
                        <span style={{marginTop: -0.6}}>My notes &nbsp;</span>
                        <Link style={{fontWeight: 400, color: '#2bb259'}} onClick={handleNotesOpen}>edit</Link>
                        &nbsp;•&nbsp;
                        <Link style={{fontWeight: 400, color: '#2bb259'}} onClick={removeNotes}>remove</Link>
                    </div>
                    <div style={{
                        fontSize: contentsFontSize,
                        marginLeft: 10,
                        fontWeight: 400,
                        fontStyle: 'italic'
                    }}>{entryNotes}</div>
                </div>

                : <div style={{fontWeight: 700, marginTop: 15}}>
                    <Link style={{fontWeight: 600, color: '#2bb259', textDecoration:'none', cursor:'pointer'}} onClick={handleNotesOpen}>
                        Add your own notes
                    </Link>
                </div>
            }

            <DisplayDialog dialogContent={dialogContent} open={notesOpen} handleClose={handleNotesClose}
                           width={isMobile ? 350 : 550}/>

        </React.Fragment>
    )

}