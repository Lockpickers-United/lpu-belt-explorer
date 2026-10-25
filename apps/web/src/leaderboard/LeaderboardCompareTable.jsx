import React, {useMemo} from 'react'
import useData from '../util/useData.jsx'
import {collectionsStatsCurrent} from '../data/dataUrls'
import {getEntryFromId} from '../entries/entryutils'
import LeaderboardCompareRow from './LeaderboardCompareRow.jsx'

function LeaderboardCompareTable({data}) {

    const collectionsStats = useData({url: collectionsStatsCurrent})
    const popularLocks = useMemo(() => {
        return collectionsStats.data ? collectionsStats.data.blackBeltOnly.listStats.recordedLocks.topItems : []
    }, [collectionsStats])

    const popularEntries = useMemo(() => popularLocks.map(lock => ({
        ...getEntryFromId(lock['id']),
        lockName: lock.name,
        popularityRank: lock.rank,
        userCount: lock.saveCount
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