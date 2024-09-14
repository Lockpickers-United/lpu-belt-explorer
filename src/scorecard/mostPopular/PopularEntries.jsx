import React, {useState, useMemo, useContext, useCallback} from 'react'
import Button from '@mui/material/Button'
import ScorecardDataContext from '../ScorecardDataProvider'
import useWindowSize from '../../util/useWindowSize.jsx'
import allEntries from '../../data/data.json'
import PopularEntry from './PopularEntry.jsx'
import List from '@mui/material/List'
import {collectionsFullBB} from '../../data/dataUrls'
import useData from '../../util/useData.jsx'
import Fade from '@mui/material/Fade'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'

function PopularEntries({owner}) {
    const {isMobile} = useWindowSize()

    const {visibleEntries = []} = useContext(ScorecardDataContext)
    const {data, loading, error} = useData({urls})
    const scorecardLocks = useMemo(() => data?.collectionsFullBB?.scorecardLocks,[data])

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [])

    const getEvidenceFromId = useCallback(id => {
        return visibleEntries.find(e => e.matchId === id)
    }, [visibleEntries])

    const [topN, setTopN] = useState(25)
    const [filter, setFilter] = useState('all')
    const [transition, setTransition] = useState(true)

    const popularEntries = useMemo(() => {
        return scorecardLocks && !error
            ? scorecardLocks?.reduce((acc, lock) => {
                const entry = getEntryFromId(lock.lockID)
                const evidence = getEvidenceFromId(lock.lockID)
                if (entry && !evidence?.exceptionType) {
                    acc.push({...entry, evidence: evidence, popularityRank: lock.rank, userCount: lock.userCount})
                }
                return acc
            }, []).filter(x => x)
            : []
    }, [error, getEntryFromId, getEvidenceFromId, scorecardLocks])

    const filteredEntries = useMemo(() => {
        return filter === 'picked'
            ? popularEntries.filter(e => e.evidence)
            : filter === 'notPicked'
                ? popularEntries.filter(e => !e.evidence)
                : popularEntries
    }, [filter, popularEntries]).slice(0, topN)

    const pickedEntries = filteredEntries.filter(e => e.evidence).length
    const pickedPercent = Math.floor(pickedEntries / topN * 1000) / 10
    const description = owner
        ? 'You\'ve picked'
        : 'Picked'

    const handleToggle = useCallback(value => () => {
        setTransition(false)
        setTopN(value)
        setTimeout(() => setTransition(true), 300)
    }, [])

    const flexStyle = isMobile ? 'block' : 'flex'

    const button25 = topN === 25 ? 'contained' : 'text'
    const button50 = topN === 50 ? 'contained' : 'text'
    const button100 = topN === 100 ? 'contained' : 'text'

    const buttonAll = filter === 'all' ? 'contained' : 'text'
    const buttonPicked = filter === 'picked' ? 'contained' : 'text'
    const buttonNotPicked = filter === 'notPicked' ? 'contained' : 'text'

    if (loading) return <LoadingDisplay/>
    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>


            <div style={{
                width: '100%',
                textAlign: 'center',
                padding: '0px 20px 24px 20px'
            }}>

                <Fade in={transition}>
                    <div style={{fontSize: '1.2rem', fontWeight: 700}}>{description} {pickedEntries} of the {topN} most
                        popular locks in BB Scorecards ({pickedPercent}%)
                    </div>
                </Fade>
                (only entries with documentation are counted)

                <div style={{marginTop: 20, display: flexStyle, padding: '0px 20px'}}>

                    <div style={{flexGrow: 1, textAlign: 'left', fontSize: '1rem', marginTop: 6}}>
                        <Button onClick={() => setFilter('all')}
                                color='info'
                                variant={buttonAll}
                                value='all'
                                style={{padding: '2px 8px 2px 8px', minWidth: 35, lineHeight: '1rem', marginRight:6}}>
                            All
                        </Button>
                        <Button onClick={() => setFilter('picked')}
                                color='info'
                                variant={buttonPicked}
                                value='picked'
                                style={{padding: '2px 8px 2px 8px', minWidth: 35, lineHeight: '1rem', marginRight:2}}>
                            Picked
                        </Button>
                        <Button onClick={() => setFilter('notPicked')}
                                color='info'
                                variant={buttonNotPicked}
                                value='notPicked'
                                style={{padding: '2px 8px 2px 8px', minWidth: 35, lineHeight: '1rem'}}>
                            Not Picked
                        </Button>
                    </div>

                    <div style={{flexGrow: 1, textAlign: 'right', fontSize: '1rem', marginTop: 6}}>
                        Top Locks:&nbsp;&nbsp;
                        <Button onClick={handleToggle(25)}
                                color='info'
                                variant={button25}
                                value='25'
                                style={{padding: '2px 2px 2px 2px', minWidth: 35, lineHeight: '1rem'}}>
                            25
                        </Button>
                        <Button onClick={handleToggle(50)}
                                variant={button50}
                                color='info'
                                value='50'
                                style={{padding: '2px 2px 2px 2px', minWidth: 35, lineHeight: '1rem'}}>
                            50
                        </Button>
                        <Button onClick={handleToggle(100)}
                                color='info'
                                variant={button100}
                                value='100'
                                style={{padding: '2px 2px 2px 2px', minWidth: 35, lineHeight: '1rem'}}>
                            100
                        </Button>

                    </div>
                </div>
            </div>

            <div>
                {filteredEntries.map(entry =>
                    <List dense style={{padding: 0}} key={entry.id}>
                        <PopularEntry entry={entry}/>
                    </List>
                )}
            </div>
        </div>
    )
}

const urls = {
    collectionsFullBB
}

export default PopularEntries
