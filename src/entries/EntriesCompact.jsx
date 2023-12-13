import React, {useContext, useDeferredValue, useMemo} from 'react'
import Entry from './Entry'
import EntryCompact from './EntryCompact'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import BeltRequirements from '../info/BeltRequirements'
import DataContext from '../contexts/DataContext'
import AppContext from '../contexts/AppContext'
import NoEntriesCard from './NoEntriesCard'
import InlineHeaderDisplay from './InlineHeaderDisplay'
import InlineDisplaySpacer from './InlineDisplaySpacer.jsx'
console.log('EntriesCompact start')

function EntriesCompact() {
    const {allEntries, visibleEntries = []} = useContext(DataContext)
    const {tab, expanded, setExpanded, displayAll} = useContext(AppContext)

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

                <InlineDisplaySpacer/>
                <InlineHeaderDisplay/>
                <InlineFilterDisplay/>

                {defTab !== 'search' && <BeltRequirements belt={defTab}/>}

                {entries.length === 0 && <NoEntriesCard/>}

                {entries.map(entry =>
                    <EntryCompact
                        key={entry.id}
                        entry={entry}
                        expanded={entry.id === defExpanded}
                        onExpand={setExpanded}
                    />
                )}
            </div>
        </React.Fragment>
    )
}
console.log('EntriesCompact end')

export default EntriesCompact
