import React, {useState, useMemo, useContext, useCallback, useDeferredValue} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import DBContext from '../app/DBContext.jsx'

import ScorecardRow from './ScorecardRow.jsx'
import ScorecardListContext from './ScorecardListContext.jsx'
import ScoringExceptions from './ScoringExceptions.jsx'
import ScorecardDataContext from './ScorecardDataProvider'

function Scorecard({owner, profile}) {
    const {visibleEntries = [], cardEvidence, cardBBCount, cardDanPoints} = useContext(ScorecardDataContext)
    const {removeAllEvidence, importUnclaimedEvidence, createEvidenceForEntries} = useContext(DBContext)

    const [tabToImport, setTabToImport] = useState('')
    const {expanded, setExpanded} = useContext(ScorecardListContext)
    const defExpanded = useDeferredValue(owner && expanded)

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

    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#000',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <div style={{display: 'flex'}}>
                <div style={{marginLeft: 0}}>

                    {owner && cardEvidence.length > 0 ?
                        <Button color='secondary' size='large' onClick={handleDeleteAll}>DELETE&nbsp;ALL</Button>
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
                </div>
                <div style={{
                    width: '20%',
                }}>
                    {owner &&
                        <Badge badgeContent={recordedIdsToMerge.length}>
                            <Button color='secondary' size='large' onClick={handleMergeRecorded}>MERGE&nbsp;RECORDED</Button>
                        </Badge>
                    }
                </div>
                <div style={{
                    width: '80%',
                    textAlign: 'right',
                    padding: '10px 12px 8px 0px'
                }}>
                    <ScoringExceptions/>
                    <span style={{fontWeight: 700}}>{cardBBCount} Black Belt Lock{cardBBCount !== 1 &&
                        <span>s</span>}, </span>
                    <span style={{fontWeight: 700}}>{cardDanPoints} Dan Point{cardDanPoints !== 1 && <span>s</span>}</span>
                </div>

            </div>

            <div>
                {visibleEntries.map(ev =>
                    <ScorecardRow key={ev.id}
                                  owner={owner}
                                  evid={ev}
                                  expanded={ev.id === defExpanded}
                                  onExpand={setExpanded}
                    />
                )}
            </div>
        </div>
    )
}

export default Scorecard
