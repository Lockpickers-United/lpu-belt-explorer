import React, {useState, useContext, useDeferredValue, useMemo} from 'react'
import CompactEntries from './CompactEntries'
import Entry from '../entries/Entry'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
import BeltRequirements from '../info/BeltRequirements'
import DataContext from './LockDataProvider'
import LockListContext from './LockListContext'
import NoEntriesCard from './NoEntriesCard'
import HotkeyInfoButton from './HotkeyInfoButton'
import RandomEntryButton from './RandomEntryButton'
import SlideshowButton from './SlideshowButton'
import ExportButton from './ExportButton'
import Footer from '../nav/Footer'

function Entries({profile}) {
    const {compact, tab, expanded, displayAll} = useContext(LockListContext)
    const {allEntries, visibleEntries = []} = useContext(DataContext)

    const [entryExpanded, setEntryExpanded] = useState(expanded)
    const defTab = useDeferredValue(tab)
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

    const footer = (
        <React.Fragment>
            <br/>
            <HotkeyInfoButton/>
            &nbsp;•&nbsp;
            <RandomEntryButton onSelect={setEntryExpanded}/>
            &nbsp;•&nbsp;
            <ExportButton/>
            &nbsp;•&nbsp;
            <SlideshowButton/>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>
                <InlineFilterDisplay profile={profile} collectionType={'locks'}/>

                {(defTab !== 'search' && entries.length !== 0) && <BeltRequirements belt={defTab}/>}

                {entries.length === 0 && <NoEntriesCard label='Locks'/>}

                {compact
                    ? <CompactEntries entries={entries}/>
                    : entries.map(entry =>
                        <Entry
                            key={entry.id}
                            entry={entry}
                            expanded={entry.id === entryExpanded}
                            onExpand={setEntryExpanded}
                        />
                    )
                }

            </div>
            <Footer extras={footer}/>
        </React.Fragment>
    )
}

export default Entries
