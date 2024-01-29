import React, {useMemo} from 'react'
import {collectionOptions} from '../data/collectionTypes'
import allEntries from '../data/data.json'
import Entry from '../entries/Entry'

function ProfilePage({data}) {
    const entries = useMemo(() => {
        const uniqueIds = new Set(collectionOptions
            .flatMap(({key}) => data[key]))
        return allEntries.filter(entry => uniqueIds.has(entry.id))
    }, [data])

    return (
        <div style={{margin: 8, paddingBottom: 32}}>
            {
                entries.map(entry =>
                    <Entry
                        key={entry.id}
                        entry={entry}
                    />
                )
            }
        </div>
    )
}

export default ProfilePage
