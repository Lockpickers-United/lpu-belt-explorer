import React, {useState, useMemo, useContext, useCallback} from 'react'
import Button from '@mui/material/Button'
import DBContext from '../app/DBContext.jsx'
import ScorecardRow from './ScorecardRow.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
import AddProjectButton from './AddProjectButton.jsx'
import InlineScorecardCharts from './InlineScorecardCharts'
import ImportDanSheetButton from './ImportDanSheetButton.jsx'
import ScorecardDanStats from './ScorecardDanStats.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

function Scorecard({owner, profile}) {
    const {isMobile} = useWindowSize()

    const scorecardName = profile?.displayName
        ? profile.displayName.slice(-1).toLowerCase() === 's'
            ? profile.displayName + '\''
            : profile.displayName + '\'s'
        : 'User'

    const {visibleEntries = [], cardEvidence, cardBBCount, cardDanPoints} = useContext(ScorecardDataContext)
    const {createEvidenceForEntries} = useContext(DBContext)

    const [expanded, setExpanded] = useState(false)

    const recordedIdsToMerge = useMemo(() => {
        if (profile && profile.recorded) {
            const evIds = cardEvidence.map(ev => ev.matchId)
            return profile.recorded.filter(id => !evIds.includes(id))
        } else {
            return []
        }
    }, [profile, cardEvidence])

    const handleMergeRecorded = useCallback(() => {
        createEvidenceForEntries(recordedIdsToMerge)
    }, [createEvidenceForEntries, recordedIdsToMerge])

    const buttonsMargin = isMobile ? 10 : 40
    const headerDivStyle  = isMobile ? 'block' : 'flex'
    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>
            <div style={{fontSize: '24px', lineHeight: '26px', padding: 16}}>
                {scorecardName} Scorecard<br/>
            </div>

            {!isMobile &&
            <div style={{display: headerDivStyle, padding: '0px 0px 0px 16px'}}>
                <div style={{marginRight:0, width:350}}>
                    <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                </div>
                <div style={{flexGrow: 1, marginRight:0, }}></div>
                <ScorecardDanStats cardDanPoints={cardDanPoints} cardBBCount={cardBBCount}/>
            </div>
            }
            {isMobile &&
            <div style={{display: headerDivStyle, padding: '0px 0px 0px 16px'}}>
                <ScorecardDanStats cardDanPoints={cardDanPoints} cardBBCount={cardBBCount}/>
                <div style={{marginRight:0, width:350}}>
                    <InlineScorecardCharts profile={profile} entries={visibleEntries}/>
                </div>
            </div>
            }

            {owner &&
                <div style={{
                    paddingLeft: buttonsMargin,
                    paddingRight: buttonsMargin,
                    display: 'flex',
                    placeItems: 'center',
                    width: '100%'
                }}>

                    <div style={{width: '33%', textAlign: 'center'}}>
                        <Button color='secondary' size='small'
                                onClick={handleMergeRecorded}>MERGE RECORDED&nbsp;({recordedIdsToMerge.length})
                        </Button>
                    </div>

                    <div style={{width: '33%', textAlign: 'center'}}>
                        <ImportDanSheetButton owner={owner} cardEvidence={cardEvidence}/>
                    </div>

                    <div style={{width: '33%', textAlign: 'center'}}>
                        <AddProjectButton/>
                    </div>
                </div>
            }

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
