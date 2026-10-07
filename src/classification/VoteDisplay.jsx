import React, {useState} from 'react'
import {Collapse} from '@mui/material'
import VoteView from './VoteView.jsx'
import VoteForm from './VoteForm.jsx'
import Button from '@mui/material/Button'

export default function VoteDisplay({vote = {}, owner, entry, previous = false}) {
    const [editing, setEditing] = useState(false)
    const handleActive = type => setEditing(type === 'voteForm')

    return (
        <div style={{marginBottom: owner ? 24 : 8}}>
            <Collapse in={!vote?.id && !editing}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16}}>
                    <Button onClick={() => handleActive('voteForm')} variant='text' size='small'
                            style={{color: '#ddd'}}>Add Your Belt Ranking Vote</Button>
                </div>
            </Collapse>
            <Collapse in={Boolean(vote?.id) && !editing}>
                <VoteView vote={vote} handleActive={handleActive} owner={owner} previous={previous}/>
            </Collapse>
            <Collapse in={editing}>
                {editing && <VoteForm entry={entry} vote={vote} handleActive={handleActive} owner={owner}/>}
            </Collapse>
        </div>
    )
}
