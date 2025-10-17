import React, {useState, useContext, useDeferredValue, useEffect} from 'react'
import Entry from '../entries/Entry'
import CompactEntries from '../locks/CompactEntries'
import DataContext from '../locks/LockDataProvider'
import LockListContext from '../locks/LockListContext'
import InlineCollectionCharts from './InlineCollectionCharts'
import ProfileHeader from './ProfileHeader.jsx'
import RandomProfileEntryButton from './RandomProfileEntryButton.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import FilterContext from '../context/FilterContext.jsx'

function ProfilePage({profile, owner}) {
    const {compact} = useContext(LockListContext)
    const [expanded, setExpanded] = useState(false)
    const {visibleEntries = []} = useContext(DataContext)
    const defExpanded = useDeferredValue(expanded)
    const {setAdvancedFilterGroups, advancedFilterGroups} = useContext(FilterContext)

    const [initialRender, setInitialRender] = useState(true)
    useEffect(() => {
        const newGroup = {
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName: 'collection',
            matchType: 'Is',
            operator: 'OR',
            values: ['Any']
        }
        if (initialRender && advancedFilterGroups().length === 0 ) setAdvancedFilterGroups([newGroup])
        setInitialRender(false)
    }, [advancedFilterGroups, initialRender, setAdvancedFilterGroups])

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
