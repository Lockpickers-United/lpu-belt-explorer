import React, {useState} from 'react'
import {Collapse} from '@mui/material'
import VoteView from './VoteView.jsx'
import VoteForm from './VoteForm.jsx'
import Button from '@mui/material/Button'

export default function VoteDisplay({vote = {}, owner, entry}) {
    const [active, setActive] = useState(vote ? {userVote: true} : {})
    const handleActive = (type) => {
        setActive( type ? {[type]: true} : {})
    }

    return (
        <div style={{marginBottom: owner ? 24 : 8}}>
            <Collapse in={!vote?.id && !active.voteForm}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16}}>
                    <Button onClick={() => handleActive('voteForm')} variant='text' size='small'
                            style={{color: '#ddd'}}>Add Your Belt Ranking Vote</Button>
                </div>
            </Collapse>
            <Collapse in={vote?.id && !active.voteForm}>
                <VoteView vote={vote} handleActive={handleActive} owner={owner}/>
            </Collapse>
            <Collapse in={active.voteForm}>
                <VoteForm entry={entry} vote={vote} handleActive={handleActive} owner={owner}/>
            </Collapse>
        </div>
    )
}