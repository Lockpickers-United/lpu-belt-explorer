import React, {useMemo} from 'react'
import useData from '../util/useData.jsx'
import {collectionsFullBB} from '../data/dataUrls'
import {getEntryFromId} from '../entries/entryutils'
import LeaderboardCompareRow from './LeaderboardCompareRow.jsx'

function LeaderboardCompareTable({data}) {

    const bbDataResult = useData({url: collectionsFullBB})
    const popularLocks = useMemo(() => {
        return bbDataResult.data ? bbDataResult.data['scorecardLocks'] : []
    }, [bbDataResult.data])

    const popularEntries = useMemo(() => popularLocks.map(lock => ({
        ...getEntryFromId(lock['lockID']),
        popularityRank: lock.rank,
        userCount: lock.count
    })), [popularLocks]).slice(0, 100)

    return (
        <React.Fragment>
            {popularEntries.map(entry => {
                return (
                    <LeaderboardCompareRow entry={entry} data={data} key={entry.id}/>
                )
            })
            }
        </React.Fragment>
    )
}

export default LeaderboardCompareTable