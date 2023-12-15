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
import FilterContext from '../contexts/FilterContext'
import DBContext from "../contexts/DBContext.jsx"
import EntryList from './EntryList.jsx'


console.log('EntryCompact start')

function EntriesCompact() {
    const {filters} = useContext(FilterContext)
    const {filterCount} = useContext(FilterContext)
    const {lockCollection} = useContext(DBContext)

    console.log(filters)
    console.log(lockCollection)
    console.log(filters.collection)

    const collectionFiltered = filters.collection?.match(/^(Own|Picked|Recorded|Wishlist)$/) ? true : false
    console.log(collectionFiltered)

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

    const splitDisplay = false
    const listDisplay = false
    const compactDisplay = false

    return <Entry
        key={entry.id}
        entry={entry}
        expanded={entry.id === defExpanded}
        onExpand={setExpanded}
    />

    function EntryObject(entry, index) {
        if (compactDisplay && collectionFiltered) {
            return <EntryCompact
                key={entry.id}
                entry={entry}
                expanded={entry.id === defExpanded}
                onExpand={setExpanded}
            />
        } else if (listDisplay && splitDisplay && collectionFiltered) {
            return <EntryList key={entry.id} entry={entry} index={index}/>
        } else {
            return <Entry
                key={entry.id}
                entry={entry}
                expanded={entry.id === defExpanded}
                onExpand={setExpanded}
            />
        }
    }

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>

                <InlineDisplaySpacer/>
                <InlineHeaderDisplay/>
                <InlineFilterDisplay/>

                {defTab !== 'search' && <BeltRequirements belt={defTab}/>}
                {entries.length === 0 && <NoEntriesCard/>}

                {entries.map((entry, index) =>
                    EntryObject(entry,index)
                )}
            </div>
        </React.Fragment>
    )
}

export default EntriesCompact
