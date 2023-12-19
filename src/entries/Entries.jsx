import React, {useContext, useDeferredValue, useMemo} from 'react'
import CompactEntries from './CompactEntries'
import Entry from './Entry'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import BeltRequirements from '../info/BeltRequirements'
import DataContext from '../contexts/DataContext'
import AppContext from '../contexts/AppContext'
import NoEntriesCard from './NoEntriesCard'

function Entries() {
    const {compact, tab, expanded, setExpanded, displayAll} = useContext(AppContext)
    const {allEntries, visibleEntries = []} = useContext(DataContext)

    const defTab = useDeferredValue(tab)
    const defExpanded = useDeferredValue(expanded)
    const defDisplayAll = useDeferredValue(displayAll)

    const entries = useMemo(() => {
        if (defTab === 'search') {
            return defDisplayAll || allEntries.length !== visibleEntries.length
                ? visibleEntries
                : []
        } else {
            return visibleEntries.filter(entry => entry.simpleBelt === defTab)
        }
    }, [defDisplayAll, defTab, allEntries, visibleEntries])

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>
                <InlineFilterDisplay/>

                {defTab !== 'search' && <BeltRequirements belt={defTab}/>}

                {entries.length === 0 && <NoEntriesCard/>}

                {compact
                    ? <CompactEntries entries={entries}/>
                    : entries.map(entry =>
                        <Entry
                            key={entry.id}
                            entry={entry}
                            expanded={entry.id === defExpanded}
                            onExpand={setExpanded}
                        />
                    )
                }

            </div>
        </React.Fragment>
    )
}

export default Entries
