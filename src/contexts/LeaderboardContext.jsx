import React, {useEffect, useMemo, useState} from 'react'

const LeaderboardContext = React.createContext({})

export function LeaderboardProvider({children}) {

    const [leaderboardData, setLeaderboardData] = useState([])

    useEffect(() => {
        const load = async () => {
            const value = (await import('../data/leaderboardData.json')).default
            setLeaderboardData(value)
            console.log(leaderboardData)
        }
        load()
    }, [leaderboardData])

    const value = useMemo(() => ({
        leaderboardData
    }), [leaderboardData])

    console.log(value)

    // Breaks. Do I need this?
    //if (!value?.length) return null
    console.log('not null')

    return (
        <LeaderboardContext.Provider value={value}>
            {children}
        </LeaderboardContext.Provider>
    )
}

export default LeaderboardContext
