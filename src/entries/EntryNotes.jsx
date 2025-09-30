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
import rehypeExternalLinks from 'rehype-external-links'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import RatingTable from '../misc/RatingTable.jsx'
import {Collapse} from '@mui/material'

export default function EntryNotes({entry}) {
    const {isLoggedIn} = useContext(AuthContext)
    const {userLockNotes, updateProfileField} = useContext(DBContext)

    const lockNotes = isLoggedIn ? userLockNotes[entry.id] : {}
    const entryNotes = typeof lockNotes === 'string'
        ? lockNotes || ''
        : (lockNotes && lockNotes.notes) || ''

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
    const [ratings, setRatings] = useState(lockNotes?.ratings || {})
    const [ratingsChanged, setRatingsChanged] = useState(false)

    useEffect(() => {
        setInputValue(entryNotes || '')
    }, [entryNotes])

    const handleChange = useCallback((event) => {
        setInputValue(sanitizeValues(event.target.value, {profanityOK: true, urlsOK: true}))
    }, [])

    const handleRatingChange = useCallback(({dimension, rating}) => {
        setRatings({...ratings, [dimension]: rating})
        setRatingsChanged(true)
    }, [ratings])

    const saveNotes = useCallback(async () => {
        const updatedUserLockNotes = {
            ...userLockNotes,
            [entry.id]: {notes: inputValue || ''}
        }
        Object.keys(ratings).length > 0 && (updatedUserLockNotes[entry.id].ratings = ratings)
        await handleSaveNotes(updatedUserLockNotes)
            .catch(error => {
                console.error('Error updating notes:', error)
            })
        handleNotesClose()
        setRatingsChanged(false)
    }, [userLockNotes, entry.id, inputValue, ratings, handleSaveNotes, handleNotesClose])

    const removeNotes = useCallback(async () => {
        const updatedUserLockNotes = {...userLockNotes}
        delete updatedUserLockNotes[entry.id]
        await handleSaveNotes(updatedUserLockNotes)
            .catch(error => {
                console.error('Error removing notes:', error)
            })
        handleNotesClose()
        setRatings({})
        setRatingsChanged(false)

    }, [entry.id, handleNotesClose, handleSaveNotes, userLockNotes])

    const {isMobile, flexStyle} = useWindowSize()
    const optionalHeaderStyle = {fontSize: '1.0rem', fontWeight: 400, marginBottom: 5, paddingLeft: 2, color: '#fff'}
    const contentsFontSize = isMobile ? '0.85rem' : '0.9rem'
    const notesBaseRows = isMobile ? 5 : 8
    const notesLineBreaks = entryNotes.split('\n').length
    const notesRows = notesLineBreaks > notesBaseRows ? Math.min(notesLineBreaks, 12) : notesBaseRows
    const notesMarginLeft = isMobile ? 5 : 10
    const ratingDimensions = {Difficulty: 'Difficulty', Fun: 'Fun'}

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
                               placeholder='Add your own private notes about this lock, visible only to you.'
                               variant='outlined'
                               autoFocus
                               inputProps={{maxLength: 1200, style: {fontSize: contentsFontSize}}}
                    />
                    <div style={{display: 'flex', marginTop: 5}}>
                        <RatingTable ratingDimensions={ratingDimensions} onRatingChange={handleRatingChange}
                                     ratings={ratings} emptyColor={'#555'}
                                     fontSize={'0.85rem'} size={20} paddingData={0}/>
                    </div>
                    <div style={{flexGrow: 1, textAlign: 'right', marginTop: 8}}>
                        <Button variant='text' size='small' onClick={handleNotesClose}>Cancel</Button>
                        <Button variant='text' size='small' onClick={saveNotes} color='success'>Save</Button>
                    </div>
                </div>
                : <div style={{flexGrow: 1, padding: '40px 20px', placeItems: 'center'}}>
                    <div style={{...optionalHeaderStyle, marginBottom: 15, fontWeight: 700, textAlign: 'center'}}>
                        Please sign in to add your<br/>
                        own private notes for locks.
                    </div>
                    <div style={{width: 210}}><SignInButton onClick={handleNotesClose}/></div>
                </div>
            }
        </div>
    )

    return (
        <React.Fragment>
            {Object.keys(lockNotes || {}).length > 0
                ? <div style={{fontWeight: 700, marginTop: 15}}>
                    <div style={{display: 'flex'}}>
                        <span style={{}}>My private notes &nbsp;</span>
                        <Link style={{fontWeight: 400, color: '#2bb259'}} onClick={handleNotesOpen}>edit</Link>
                        &nbsp;•&nbsp;
                        <Link style={{fontWeight: 400, color: '#2bb259'}} onClick={removeNotes}>remove</Link>
                    </div>
                    <div style={{
                        fontSize: contentsFontSize,
                        marginLeft: notesMarginLeft,
                        fontWeight: 400
                    }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {
                            target: '_blank',
                            rel: ['nofollow', 'noopener', 'noreferrer']
                        }]]}>
                            {entryNotes}
                        </ReactMarkdown>
                        {!entryNotes && <div style={{height: 8}}/>}
                        <div style={{display: flexStyle, height: 32, justifyContent: 'flex-start', alignItems: 'center'}}>
                            <RatingTable ratingDimensions={ratingDimensions} onRatingChange={handleRatingChange}
                                         ratings={ratings} readonly={false}
                                         fontSize={'0.85rem'} size={19} paddingData={0}/>
                            {ratingsChanged && !isMobile &&
                                <Button variant='text' size='small' onClick={saveNotes} color='success'>Save</Button>
                            }
                            <Collapse in={ratingsChanged && isMobile} style={{}}>
                                <div style={{display: 'flex', flexGrow: 1, width: '100%', justifyContent: 'center'}}>
                                    <Button variant='text' size='small' onClick={handleNotesClose}
                                    style={{color:'#777'}}>Cancel</Button>
                                    <Button variant='text' size='small' onClick={saveNotes}
                                            color='success'>Save</Button>
                                </div>
                            </Collapse>
                        </div>

                        <Collapse in={ratingsChanged && isMobile} style={{textAlign: 'right'}}>
                            <div style={{height: 22}}/>
                        </Collapse>

                    </div>

                </div>

                : <div style={{fontWeight: 700, marginTop: 15}}>
                    <Link style={{fontWeight: 600, color: '#2bb259', textDecoration: 'none', cursor: 'pointer'}}
                          onClick={handleNotesOpen}>
                        Add your own private notes
                    </Link>
                </div>
            }

            <DisplayDialog dialogContent={dialogContent} open={notesOpen} handleClose={handleNotesClose}
                           width={isMobile ? 350 : 550}/>

        </React.Fragment>
    )

}