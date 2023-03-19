import React, {useContext, useDeferredValue, useMemo} from 'react'
import Entry from './Entry.jsx'
import InlineFilterDisplay from '../filters/InlineFilterDisplay.jsx'
import BeltRequirements from '../info/BeltRequirements.jsx'
import DataContext from '../contexts/DataContext.jsx'
import AppContext from '../contexts/AppContext.jsx'
import NoEntriesCard from './NoEntriesCard.jsx'
import {useState} from 'react'
import {useCallback} from 'react'
import {useEffect} from 'react'

function Entries() {
    const {allEntries, visibleEntries} = useContext(DataContext)
    const {tab, expanded, setExpanded} = useContext(AppContext)

    const defTab = useDeferredValue(tab)
    const defExpanded = useDeferredValue(expanded)

    const [displayAll, setDisplayAll] = useState(false)
    const handleDisplayAll = useCallback(() => {
        setTimeout(() => setDisplayAll(true), 100)
    }, [])

    const entries = useMemo(() => {
        if (defTab === 'search') {
            return displayAll || allEntries.length !== visibleEntries.length
                ? visibleEntries
                : []
        } else {
            return visibleEntries.filter(entry => entry.simpleBelt === defTab)
        }
    }, [displayAll, defTab, allEntries, visibleEntries])

    useEffect(() => {
        if (defTab !== 'search') setDisplayAll(false)
    }, [defTab])

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>
                <InlineFilterDisplay/>

                {defTab !== 'search' && <BeltRequirements belt={defTab}/>}

                {entries.length === 0 && <NoEntriesCard onDisplayAll={handleDisplayAll}/>}

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
