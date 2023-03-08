import React, {useContext, useDeferredValue, useMemo} from 'react'
import Entry from './Entry.jsx'
import InlineFilterDisplay from '../filters/InlineFilterDisplay.jsx'
import BeltRequirements from '../info/BeltRequirements.jsx'
import DataContext from '../contexts/DataContext.jsx'
import AppContext from '../contexts/AppContext.jsx'
import NoEntriesCard from './NoEntriesCard.jsx'

function Entries() {
    const {visibleEntries} = useContext(DataContext)
    const {tab, expanded, setExpanded} = useContext(AppContext)
    const defTab = useDeferredValue(tab)
    const defExpanded = useDeferredValue(expanded)

    const entries = useMemo(() => {
        return defTab === 'search'
            ? visibleEntries
            : visibleEntries.filter(entry => entry.simpleBelt === defTab)
    }, [defTab, visibleEntries])

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>
                <InlineFilterDisplay/>

                {defTab !== 'search' && <BeltRequirements belt={defTab}/>}

                {entries.length === 0 && <NoEntriesCard/>}

                {entries.map(entry =>
                    <Entry
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

export default Entries
