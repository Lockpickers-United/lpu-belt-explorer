import React, {useState, useContext, useMemo} from 'react'
import CompactEntries from '../locks/CompactEntries'
import Entry from '../entries/Entry.jsx'
import BeltRequirements from '../info/BeltRequirements.jsx'
import DataContext from '../locks/LockDataProvider'
import LockListContext from '../locks/LockListContext'
import NoEntriesCard from '../locks/NoEntriesCard'
import HotkeyInfoButton from '../locks/HotkeyInfoButton'
import RandomEntryButton from '../locks/RandomEntryButton'
import SlideshowButton from '../locks/SlideshowButton'
import ExportButton from '../locks/ExportButton'
import Footer from '../nav/Footer'
import FilterContext from '../context/FilterContext.jsx'
import AppContext from '../app/AppContext.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'

export default function ClassificationEntries({advancedEnabled = false}) {
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

                <div aria-label='Locks' role='list'>
                    {compact
                        ? <CompactEntries entries={entries}/>
                        : entries.map((entry) =>
                            <Entry
                                key={entry.id}
                                entry={entry}
                                expanded={entry.id === entryExpanded
                                    || !!expandAll
                                    || visibleEntries.length === 1}
                                onExpand={setEntryExpanded}
                                isClassification={true}
                            />
                        )
                    }
                </div>
            </div>
            <Footer extras={footer} before={footerBefore}/>
        </React.Fragment>
    )
}