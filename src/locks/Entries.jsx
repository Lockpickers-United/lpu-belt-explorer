import React, {useState, useContext, useMemo} from 'react'
import CompactEntries from './CompactEntries'
import EntrySimple from '../entries/EntrySimple'
import BeltRequirements from '../info/BeltRequirements.jsx'
import DataContext from './LockDataProvider'
import LockListContext from './LockListContext'
import NoEntriesCard from './NoEntriesCard'
import HotkeyInfoButton from './HotkeyInfoButton'
import RandomEntryButton from './RandomEntryButton'
import SlideshowButton from './SlideshowButton'
import ExportButton from './ExportButton'
import Footer from '../nav/Footer'
import FilterContext from '../context/FilterContext.jsx'
import AppContext from '../app/AppContext.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'

function Entries({advancedEnabled = false}) {
    const {tab} = useContext(LockListContext)
    const {compact} = useContext(AppContext)
    const {visibleEntries = [], expandAll} = useContext(DataContext)
    const {filters, filterCount, isSearch} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(filters.id)

    const entries = useMemo(() => {
        if (tab === 'search') {
            return visibleEntries
        } else {
            return visibleEntries.filter(entry => entry.simpleBelt === tab)
        }
    }, [tab, visibleEntries])

    const footerBefore = (
        <div style={{margin: '30px 0px'}}>
            <ExportButton text={true} entries={entries} advancedEnabled={advancedEnabled}/>
        </div>
    )

    const footer = (
        <React.Fragment>
            <br/>
            <HotkeyInfoButton/>
            &nbsp;•&nbsp;
            <RandomEntryButton onSelect={setEntryExpanded}/>
            &nbsp;•&nbsp;
            <SlideshowButton/>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>

                <AdvancedFilters/>

                {(tab !== 'search' && !isSearch && filterCount === 0 && entries.length !== 0) &&
                    <BeltRequirements belt={tab}/>}

                {entries.length === 0 && <NoEntriesCard label='Locks' isSearch={isSearch}/>}

                {compact
                    ? <CompactEntries entries={entries}/>
                    : entries.map((entry) =>
                        <EntrySimple
                            key={entry.id}
                            entry={entry}
                            //expanded={entry.id === entryExpanded}
                            expanded={entry.id === entryExpanded || !!expandAll}
                            onExpand={setEntryExpanded}
                        />
                    )
                }

            </div>
            <Footer extras={footer} before={footerBefore}/>
        </React.Fragment>
    )
}

export default Entries
