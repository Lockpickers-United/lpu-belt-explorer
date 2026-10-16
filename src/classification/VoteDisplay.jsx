import React, {useEffect, useState} from 'react'
import {Collapse} from '@mui/material'
import VoteView from './VoteView.jsx'
import VoteForm from './VoteForm.jsx'
import Button from '@mui/material/Button'
import {canWriteVotes} from './writeStage.js'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'

export default function VoteDisplay({vote = {}, formVote = vote, owner, entry, previous = false, entryRef}) {
    const [editing, setEditing] = useState(false)
    const [awaitingRefresh, setAwaitingRefresh] = useState(null)

    useEffect(() => {
        if (awaitingRefresh && (formVote?.id !== awaitingRefresh.id ||
            formVote?.revision !== awaitingRefresh.revision)) {
            setAwaitingRefresh(null)
        }
    }, [awaitingRefresh, formVote?.id, formVote?.revision])
    const handleActive = type => {
        if (type === 'saved') {
            setAwaitingRefresh({id: formVote?.id, revision: formVote?.revision})
        }
        setEditing(type === 'voteForm')
    }

    const showLoading = false

    return (
        <div style={{marginBottom: owner ? 24 : 8}}>
            {awaitingRefresh && showLoading &&
                <div role='status' style={{width: '100%', textAlign: 'center', marginTop: 8}}>
                    <LoadingDisplay size={22} thickness={5} style={{marginTop: 8}}/>
                </div>
            }
            <Collapse in={!vote?.id && !editing && !awaitingRefresh}>
                {entry.classificationStatus !== 'Settled'
                    ? < div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16}}>
                        <Button onClick={() => handleActive('voteForm')} variant='text' size='small'
                                disabled={!canWriteVotes}
                                style={{color: '#ddd'}}>{formVote?.id ? 'Edit Your Belt Ranking Vote' : 'Add Your Belt Ranking Vote'}</Button>
                    </div>
                    : <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 24, fontWeight: 600}}>
                        Not open to votes at this time.
                    </div>
                }
            </Collapse>
            <Collapse in={Boolean(vote?.id) && !editing && !awaitingRefresh} unmountOnExit>
                <VoteView vote={vote} handleActive={handleActive} owner={owner} previous={previous}/>
            </Collapse>
            <Collapse in={editing} unmountOnExit>
                <VoteForm entry={entry} vote={formVote} handleActive={handleActive} owner={owner} entryRef={entryRef}/>
            </Collapse>
        </div>
    )
}
