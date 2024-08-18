import React, {useState, useContext, useDeferredValue} from 'react'
import Entry from '../entries/Entry'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import CompactEntries from '../locks/CompactEntries'
import DataContext from '../locks/LockDataProvider'
import LockListContext from '../locks/LockListContext'
import InlineCollectionCharts from './InlineCollectionCharts'
import ProfileHeader from './ProfileHeader.jsx'

function ProfilePage({profile}) {
    const {compact} = useContext(LockListContext)
    const [expanded, setExpanded] = useState(false)
    const {visibleEntries = []} = useContext(DataContext)
    const defExpanded = useDeferredValue(expanded)

    return (
        <div style={{
            maxWidth: 700, padding: 0, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16
        }}>

            <ProfileHeader profile={profile} page={'collection'}/>
            <InlineFilterDisplay profile={profile} collectionType={'locks'}/>
            <InlineCollectionCharts profile={profile} entries={visibleEntries}/>

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
