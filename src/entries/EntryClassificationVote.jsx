import React, {useContext, useMemo} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import {useAccess} from '../app/AccessContext.jsx'
import DisplayClassificationVotes from '../classification/DisplayClassificationVotes.jsx'
import VoteDisplay from '../classification/VoteDisplay.jsx'
import {beltSort} from '../data/belts.js'
import dayjs from 'dayjs'
import useWindowSize from '../util/useWindowSize.jsx'

export default function EntryClassificationVote({entry, isClassification}) {
    const {user} = useContext(AuthContext)
    const {accessInfo} = useAccess()

    const userVote = useMemo(() => entry.voteEntries?.find(vote => vote.userId === user.uid) || {}, [entry.voteEntries, user.uid])
    const otherVotes = useMemo(() => {
        return entry.voteEntries?.filter(vote => vote.userId !== user.uid).sort((a, b) => {
            return beltSort(a.belt, b.belt) || dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf()
        })
    }, [entry.voteEntries, user.uid])

    const showVotes = (entry.voteEntries?.length - (userVote?.id ? 1 : 0)) > 1 && !isClassification

    const {isMobile} = useWindowSize()
    const padding = !isMobile ? '0 20px 0 8px' : '0 6px 0 0px'

    if (!accessInfo.features.classificationVote) return null


    return (
        <div style={{borderTop: '1px solid #444', padding}}>
            {showVotes &&
                <div style={{
                    display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
                    fontSize: '0.9rem', lineHeight: '1.8rem'
                }}>
                    current votes<br/>
                    <DisplayClassificationVotes votes={entry.voteEntries}/>
                </div>
            }

            <VoteDisplay entry={entry} vote={userVote} owner={userVote?.userId === user.uid}/>

            {otherVotes?.length > 0 && otherVotes.map(vote => {
                return <div key={vote.id}>
                    <VoteDisplay entry={entry} vote={vote} owner={vote.userId === user.uid}/>
                </div>
            })}
        </div>
    )
}
