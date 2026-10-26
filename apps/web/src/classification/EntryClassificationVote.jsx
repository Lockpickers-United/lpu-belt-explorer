import React, {useContext, useMemo} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import {useAccess} from '../app/AccessContext.jsx'
import VoteDisplay from './VoteDisplay.jsx'
import {beltSort} from '../data/belts.js'
import dayjs from 'dayjs'
import useWindowSize from '../util/useWindowSize.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'
import {useMatches} from 'react-router-dom'
import useClassificationEntryVotes from './useClassificationEntryVotes.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Link from '@mui/material/Link'

export default function EntryClassificationVote({entry, entryRef}) {
    const {user} = useContext(AuthContext)
    const {accessInfo} = useAccess()
    const {getUserVote, getCurrentUserVote, getSummary, ownerLoading, ownerError} = useContext(ClassificationContext)

    const matches = useMatches()
    const isClassification = matches.some(match => match.handle?.route === 'classification') &&
        !matches.some(match => match.handle?.route === 'historical')

    const userVote = getUserVote(entry)
    const currentUserVote = getCurrentUserVote(entry)
    const revision = getSummary?.(entry)?.revision
    const {votes, loading, error, reload} = useClassificationEntryVotes(entry.id, revision,
        isClassification && accessInfo.features.classificationVote)
    const currentVotes = votes.filter(vote => vote.isCurrent)
    const previousVotes = votes.filter(vote => !vote.isCurrent)

    const isLoading = useMemo(() => loading || ownerLoading, [loading, ownerLoading])
    const isError = useMemo(() => error || ownerError, [error, ownerError])

    const otherVotes = useMemo(() => {
        return currentVotes.filter(vote => vote.userId !== user.uid).sort((a, b) => {
            return beltSort(a.votedBelt, b.votedBelt) ||
                dayjs(a.updatedAt ?? a.createdAt).valueOf() - dayjs(b.updatedAt ?? b.createdAt).valueOf()
        })
    }, [currentVotes, user.uid])

    const {isMobile} = useWindowSize()
    const padding = !isMobile ? '0 20px 0 8px' : '0 6px 0 0px'

    if (!accessInfo.features.classificationVote) return null

    return (
        <div style={{borderTop: '1px solid #444', padding}}>

            {isLoading &&
                <div role='status' style={{width: '100%', textAlign: 'center', marginTop: 8}}>
                    <LoadingDisplay size={22} thickness={5} style={{marginTop: 8}}/>
                </div>
            }
            {isError &&
                <div role='alert' style={{width: '100%', textAlign: 'center', marginTop: 8}}>
                    Could not load classification votes {ownerError?.message ? ': ' + ownerError?.message : ''}<br/>
                    {error && <Link onClick={() => reload()}>Retry</Link>}
                </div>
            }

            {!isLoading && !isError &&
                <VoteDisplay entry={entry} vote={currentUserVote ?? {}} formVote={userVote ?? {}} owner entryRef={entryRef}/>
            }

            {isClassification && !isLoading && !isError &&
                <>
                    {otherVotes?.length > 0 && otherVotes.map(vote => {
                        return <div key={vote.id}>
                            <VoteDisplay entry={entry} vote={vote} owner={vote.userId === user.uid}/>
                        </div>
                    })}

                    {previousVotes.length > 0 &&
                        <div role='group' aria-label='Previous votes' style={{marginTop: 24}}>
                            <div style={{fontWeight: 600, position: 'relative', paddingLeft: 24}}>
                                <BeltStripeMini value={entry?.belt} width={16} offset={0}
                                                style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>
                                PREVIOUS VOTES
                            </div>
                            {previousVotes.map(vote => {
                                return <div key={vote.id}>
                                    <VoteDisplay entry={entry} vote={vote} previous={true}
                                                 owner={vote.userId === user.uid}/>
                                </div>
                            })}
                        </div>
                    }
                </>
            }
        </div>
    )
}
