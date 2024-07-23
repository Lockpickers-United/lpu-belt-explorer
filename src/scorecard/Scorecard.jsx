import React, {useState, useMemo, useContext, useCallback} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DBContext from '../app/DBContext.jsx'
import dans from '../data/dans.json'

import ScorecardRow from './ScorecardRow.jsx'
import ScoringExceptions from './ScoringExceptions.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
import AddProjectButton from './AddProjectButton.jsx'

function Scorecard({owner, profile}) {

    const scorecardName = profile?.displayName
        ? profile.displayName.slice(-1).toLowerCase() === 's'
            ? profile.displayName + '\''
            : profile.displayName + '\'s'
        : 'User'

    const {visibleEntries = [], cardEvidence, cardBBCount, cardDanPoints} = useContext(ScorecardDataContext)
    const {removeAllEvidence, importUnclaimedEvidence, createEvidenceForEntries} = useContext(DBContext)

    const [tabToImport, setTabToImport] = useState('')
    const [expanded, setExpanded] = useState(false)

    const recordedIdsToMerge = useMemo(() => {
        if (profile && profile.recorded) {
            const evIds = cardEvidence.map(ev => ev.matchId)
            return profile.recorded.filter(id => !evIds.includes(id))
        } else {
            return []
        }
    }, [profile, cardEvidence])

    const handleDeleteAll = useCallback(() => {
        removeAllEvidence()
    }, [removeAllEvidence])

    const handleImport = useCallback(() => {
        importUnclaimedEvidence(tabToImport)
        setTabToImport('')
    }, [tabToImport, importUnclaimedEvidence])

    const handleMergeRecorded = useCallback(() => {
        createEvidenceForEntries(recordedIdsToMerge)
    }, [createEvidenceForEntries, recordedIdsToMerge])

    const eligibleDan = dans
        ? dans.filter(dan => {
            return (cardDanPoints >= dan.points) && (cardBBCount >= dan.bbLocks)
        }).pop()?.level
        : 0
    const nextDan = dans[eligibleDan + 1]
    const nextDanPoints = Math.max(0, (nextDan.points - cardDanPoints))
    const nextDanLocks = Math.max(0, (nextDan.bbLocks - cardBBCount))

    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <div style={{display: 'flex', padding: 16}}>
                <div style={{marginLeft: 0, display: 'block'}}>

                    <div style={{fontSize: '24px', lineHeight: '26px'}}>
                        {scorecardName} Scorecard<br/>
                        <span style={{fontSize: '0.85rem'}}>
                            {nextDanPoints} point{nextDanPoints !== 1 && 's'} and {nextDanLocks} BB lock{nextDanLocks !== 1 && 's'} until next Dan
                        </span>
                    </div>

                    {owner && cardEvidence.length > 0
                        ? <div><Button color='secondary' size='small' onClick={handleDeleteAll}>DELETE&nbsp;ALL</Button>
                        </div>
                        : owner &&
                        <div>
                            <TextField
                                id='tab-to-import'
                                label='Tab to Import'
                                value={tabToImport}
                                size='small'
                                margin='dense'
                                color='secondary'
                                onChange={e => {
                                    setTabToImport(e.target.value)
                                }}
                            />
                            <Button color='secondary' size='small' sx={{margin: 1}}
                                    onClick={handleImport}>IMPORT</Button>
                        </div>
                    }

                    <div>
                        {owner &&
                            <Button color='secondary'
                                    size='small'
                                    onClick={handleMergeRecorded}>MERGE&nbsp;RECORDED&nbsp;({recordedIdsToMerge.length})
                            </Button>
                        }
                    </div>
                    <div>
                        <AddProjectButton/>
                    </div>

                </div>

                <div style={{flexGrow: 1, textAlign: 'right'}}>
                    <ScoringExceptions/>
                </div>

                <div style={{
                    textAlign: 'right',
                    padding: '10px 12px 8px 0px'
                }}>
                    <div style={{fontWeight: 700}}>
                        Eligible for Dan <span style={{fontSize: '1.8rem'}}>{eligibleDan}</span>
                    </div>

                    <div style={{marginBottom: 5}}>Dan Points <strong>{cardDanPoints}</strong></div>
                    <div style={{marginBottom: 5}}>Black Belt Locks <strong>{cardBBCount}</strong></div>
                </div>

            </div>

            <div>
                {visibleEntries.map(ev =>
                    <ScorecardRow key={ev.id}
                                  owner={owner}
                                  evid={ev}
                                  expanded={ev.id === expanded}
                                  onExpand={setExpanded}
                    />
                )}
            </div>
        </div>
    )
}

export default Scorecard
