import React, {useContext, useMemo} from 'react'
import DBContext from '../app/DBContext.jsx'
import calculateScoreForUser from '../scorecard/scoring'

const ScoringContext = React.createContext({})

export function ScoringProvider({children}) {
    const {pickerActivity} = useContext(DBContext)

    const {scoredActivity, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks} = calculateScoreForUser(pickerActivity)

    const value = useMemo(() => ({
        scoredActivity,
        bbCount,
        danPoints,
        eligibleDan,
        nextDanPoints,
        nextDanLocks
    }), [scoredActivity, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks])

    return (
        <ScoringContext.Provider value={value}>
            {children}
        </ScoringContext.Provider>
    )
}

export default ScoringContext
