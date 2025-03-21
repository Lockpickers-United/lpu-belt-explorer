import React from 'react'
import dayjs from 'dayjs'
import RecentMediaEntry from './RecentMediaEntry.jsx'
import List from '@mui/material/List'

/**
 * @property makeModels
 */

function RecentChangesPage({allEntries}) {
    const recentDays = 14

    const newImageEntries = allEntries.reduce((acc, entry) => {
        const newMedia = entry?.media?.filter(m => dayjs(m.dateAdded).isAfter(dayjs().subtract(recentDays, 'day')))
            .sort((a, b) => dayjs(b.dateAdded).diff(dayjs(a.dateAdded)))
        if (newMedia?.length > 0) {
            acc.push({
                ...entry,
                media: newMedia
            })
        }
        return acc
    }, []).sort((a, b) => {
        return Math.floor(dayjs(b.lastUpdated).valueOf() / 3600) - Math.floor(dayjs(a.lastUpdated).valueOf() / 3600)
            || `${a.makeModels[0].make}${a.makeModels[0].model}`.localeCompare(`${b.makeModels[0].make}${b.makeModels[0].model}`)
    })

    return (
        <React.Fragment>
            <div style={{
                padding: 0,
                maxWidth: 700,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 20,
                fontWeight: 500,
                fontSize: '1.5rem'
            }}>
                Recently added images (last {recentDays} days)
            </div>
            {newImageEntries.length > 0
                ? <List style={{padding: 0, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}}>
                    {newImageEntries.map((entry) =>
                        <RecentMediaEntry entry={entry} key={entry.id}/>
                    )}
                </List>
                : <div style={{
                    padding: 0,
                    maxWidth: 700,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 20,
                    fontSize: '1rem'
                }}>
                    None found
                </div>
            }
        </React.Fragment>
    )
}

export default RecentChangesPage
