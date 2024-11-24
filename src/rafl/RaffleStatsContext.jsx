import React, {useMemo} from 'react'
import useData from '../util/useData'
import {raflStats} from '../data/dataUrls'

const RaffleStatsContext = React.createContext({})
const url = {raflStats}

export function StatsProvider({children}) {
    const {data, loading, error} = useData({url})
    const {charityStats} = data || {}
    const jsonLoaded = (!loading && !error && !!data)

    const foo = 'bar'

    const allDataLoaded = ((jsonLoaded))

    const value = useMemo(() => ({
        allDataLoaded,
        charityStats,
        foo
    }), [
        allDataLoaded,
        charityStats,
        foo
    ])

    return (
        <RaffleStatsContext.Provider value={value}>
            {children}
        </RaffleStatsContext.Provider>
    )
}

export default RaffleStatsContext

