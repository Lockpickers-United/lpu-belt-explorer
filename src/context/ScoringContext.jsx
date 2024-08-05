import React, {useContext, useMemo} from 'react'
import DBContext from '../app/DBContext.jsx'
import calculateScoreForUser from '../scorecard/scoring'

const ScoringContext = React.createContext({})

export function ScoringProvider({children}) {
    const {evidence} = useContext(DBContext)

    const {scoredEvidence, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks} = calculateScoreForUser(evidence)

    const value = useMemo(() => ({
        scoredEvidence,
        bbCount,
        danPoints,
        eligibleDan,
        nextDanPoints,
        nextDanLocks
    }), [scoredEvidence, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks])

    return (
        <ScoringContext.Provider value={value}>
            {children}
        </ScoringContext.Provider>
    )
}

export default ScoringContext
