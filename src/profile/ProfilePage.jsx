import React, {useContext, useDeferredValue} from 'react'
import Entry from '../entries/Entry'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import CompactEntries from '../locks/CompactEntries'
import DataContext from '../locks/LockDataProvider'
import LockListContext from '../locks/LockListContext'
import InlineCollectionCharts from './InlineCollectionCharts'

function ProfilePage({profile}) {
    const {compact, expanded, setExpanded} = useContext(LockListContext)
    const {visibleEntries = []} = useContext(DataContext)
    const defExpanded = useDeferredValue(expanded)

    return (
        <div style={{margin: 8, paddingBottom: 32}}>

            <InlineFilterDisplay profile={profile}/>
            <InlineCollectionCharts profile={profile}/>

            {compact
                ? <CompactEntries entries={visibleEntries}/>
                : visibleEntries.map(entry =>
                    <Entry
                        key={entry.id}
                        entry={entry}
                        expanded={entry.id === defExpanded}
                        onExpand={setExpanded}
                    />
                )
            }
        </div>
    )
}

export default ProfilePage
