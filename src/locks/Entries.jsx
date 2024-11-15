import React, {useState, useContext, useDeferredValue, useMemo, useEffect} from 'react'
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
import FilterContext from '../context/FilterContext.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'

function Entries({profile}) {
    const {compact, tab, expanded} = useContext(LockListContext)
    const {visibleEntries = []} = useContext(DataContext)
    const {filterCount} = useContext(FilterContext)
    const isSearch = /search=/.test(location.hash)

    const [entryExpanded, setEntryExpanded] = useState(expanded)
    const defTab = useDeferredValue(tab)

    const entries = useMemo(() => {
        if (defTab === 'search') {
            return visibleEntries
        } else {
            return visibleEntries.filter(entry => entry.simpleBelt === defTab)
        }
    }, [defTab, visibleEntries])

    const [lastLoaded, setLastLoaded] = useState(true)
    useEffect(() => {
        if (tab === 'search') {
            setLastLoaded(false)
        }
        if (defTab === 'search') {
            setLastLoaded(true)
        }
    }, [defTab, lastLoaded, tab])


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
                {!lastLoaded && !isSearch && filterCount === 0 &&
                    <div style={{textAlign: 'center'}}>
                        <LoadingDisplay/>
                        Please wait while we load up all <b>{visibleEntries.length}</b> locks.<br/><br/>
                    </div>
                }

                {(defTab !== 'search' && !isSearch && filterCount === 0 && entries.length !== 0) &&
                    <BeltRequirements belt={defTab}/>}

                {entries.length === 0 && <NoEntriesCard label='Locks' isSearch={isSearch}/>}

                {compact
                    ? <CompactEntries entries={entries}/>
                    : entries.map((entry) =>
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
