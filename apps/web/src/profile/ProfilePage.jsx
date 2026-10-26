import React, {useState, useContext, useDeferredValue} from 'react'
import Entry from '../entries/Entry.jsx'
import CompactEntries from '../locks/CompactEntries'
import DataContext from '../locks/LockDataProvider'
import LockListContext from '../locks/LockListContext'
import InlineCollectionCharts from './InlineCollectionCharts'
import ProfileHeader from './ProfileHeader.jsx'
import RandomProfileEntryButton from './RandomProfileEntryButton.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import useDefaultAdvancedFilterGroup from '../filters/useDefaultAdvancedFilterGroup.js'

function ProfilePage({profile, pickerActivity, owner}) {
    const {compact} = useContext(LockListContext)
    const [expanded, setExpanded] = useState(false)
    const {visibleEntries = []} = useContext(DataContext)
    const defExpanded = useDeferredValue(expanded)
    useDefaultAdvancedFilterGroup({fieldName: 'collection', value: 'Any'})

    const scorecardMap = pickerActivity.reduce((acc, entry) => {
        if (entry.matchId && entry.id) acc[entry.matchId] = entry.id
        return acc
    },{})

    return (
        <React.Fragment>
            <div style={{
                maxWidth: 700, padding: 0, backgroundColor: '#222',
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16
            }}>

                <ProfileHeader profile={profile} page={'collection'} owner={owner}/>
                <InlineCollectionCharts profile={profile} entries={visibleEntries}/>
                <AdvancedFilters/>

                {compact
                    ? <CompactEntries entries={visibleEntries}/>
                    : visibleEntries.map(entry =>
                        <Entry
                            key={entry.id}
                            entry={entry}
                            expanded={entry.id === defExpanded}
                            onExpand={setExpanded}
                            scorecardId={scorecardMap[entry.id]}
                        />
                    )
                }

                <div style={{textAlign: 'center'}}>
                    <RandomProfileEntryButton onSelect={setExpanded}/>
                </div>
            </div>


        </React.Fragment>
    )
}

export default ProfilePage
