import React, {useContext, useMemo, useState} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import {useAccess} from '../app/AccessContext.jsx'
import DisplayClassificationVotes from './DisplayClassificationVotes.jsx'
import VoteDisplay from './VoteDisplay.jsx'
import {beltSort} from '../data/belts.js'
import dayjs from 'dayjs'
import useWindowSize from '../util/useWindowSize.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'
import BeltStripeMini from '../entries/BeltStripeMini.jsx'
import Button from '@mui/material/Button'
import {Collapse} from '@mui/material'
import {useMatches} from 'react-router-dom'

export default function EntryClassificationVote({entry, showCurrentVotes = true}) {
    const {user} = useContext(AuthContext)
    const {accessInfo} = useAccess()
    const {
        getUserVote,
        getHistoricalVotes,
        loadHistoricalVotes,
        historicalVotesLoaded
    } = useContext(ClassificationContext)
    const userVote = getUserVote(entry)

    const isClassification = useMatches().some(match => match.handle?.route === 'classification')

    const otherVotes = useMemo(() => {
        return entry.currentVotes?.filter(vote => vote.userId !== user.uid).sort((a, b) => {
            return beltSort(a.votedBelt, b.votedBelt) || dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf()
        })
    }, [entry.currentVotes, user.uid])

    const pastVotes = historicalVotesLoaded ? getHistoricalVotes(entry.id) : null
    const [loadingPastVotes, setLoadingPastVotes] = useState(false)
    const [pastVotesError, setPastVotesError] = useState(false)

    const loadPastVotes = async () => {
        setLoadingPastVotes(true)
        setPastVotesError(false)
        try {
            await loadHistoricalVotes()
        } catch {
            setPastVotesError(true)
        } finally {
            setLoadingPastVotes(false)
        }
    }

    const showVotes = (entry.currentVotes?.length - (userVote?.id ? 1 : 0)) > 1 && !isClassification

    const {isMobile} = useWindowSize()
    const padding = !isMobile ? '0 20px 0 8px' : '0 6px 0 0px'

    if (!accessInfo.features.classificationVote) return null

    return (
        <div style={{borderTop: '1px solid #444', padding}}>
            {showVotes && showCurrentVotes &&
                <div style={{
                    display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
                    fontSize: '0.9rem', lineHeight: '1.8rem'
                }}>
                    current votes<br/>
                    <DisplayClassificationVotes votes={entry.currentVotes}/>
                </div>
            }

            <VoteDisplay entry={entry} vote={userVote ?? {}} owner={userVote?.userId === user.uid}/>

            {otherVotes?.length > 0 && otherVotes.map(vote => {
                return <div key={vote.id}>
                    <VoteDisplay entry={entry} vote={vote} owner={vote.userId === user.uid}/>
                </div>
            })}

            {entry?.previousVotes?.length > 0 &&
                <div style={{marginTop: 24}}>
                    <div style={{fontWeight: 600, position: 'relative', paddingLeft: 24}}>
                        <BeltStripeMini value={entry?.belt} width={16} offset={0}
                                        style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>
                        PREVIOUS VOTES
                    </div>
                    {entry.previousVotes.map(vote => {
                        return <div key={vote.id}>
                            <VoteDisplay entry={entry} vote={vote} previous={true} owner={vote.userId === user.uid}/>
                        </div>
                    })}
                </div>
            }

            {isClassification &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 24,
                    width: '100%',
                    justifyContent: 'center'
                }}>
                    {!historicalVotesLoaded &&
                        <Button onClick={loadPastVotes} disabled={loadingPastVotes}>
                            {loadingPastVotes ? 'LOADING HISTORICAL VOTES...' : 'CHECK FOR HISTORICAL VOTES'}
                        </Button>
                    }

                    {pastVotesError && !historicalVotesLoaded &&
                        <div role='alert'
                             style={{width: '100%', textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem'}}>
                            Could not load historical votes. Please try again.
                        </div>
                    }

                    {pastVotes?.length === 0 &&
                        <div style={{width: '100%', textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem'}}>
                            No historical votes found
                        </div>
                    }

                    <Collapse in={pastVotes?.length > 0} style={{width: '100%'}}>
                        <div style={{fontWeight: 600, position: 'relative', paddingLeft: 24}}>
                            <BeltStripeMini value={entry?.belt} width={16} offset={0}
                                            style={{position: 'absolute', top: 0, left: 0, bottom: 0}}/>
                            HISTORICAL VOTES
                        </div>
                        {pastVotes?.map(vote => {
                            return <div key={vote.id} style={{width: '100%'}}>
                                <VoteDisplay entry={entry} vote={vote} previous={true}
                                             owner={vote.userId === user.uid}/>
                            </div>
                        })}
                    </Collapse>

                </div>
            }
        </div>
    )
}
