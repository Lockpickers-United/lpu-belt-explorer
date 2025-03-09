import React, {useState, useContext, useMemo} from 'react'
import CompactEntries from './CompactEntries'
import Entry from '../entries/Entry'
import InlineFilterDisplay from '../filters/InlineFilterDisplay'
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

function Entries({profile}) {
    const {tab, expanded} = useContext(LockListContext)
    const {compact} = useContext(AppContext)
    const {visibleEntries = []} = useContext(DataContext)
    const {filterCount, isSearch} = useContext(FilterContext)
    const [entryExpanded, setEntryExpanded] = useState(expanded)


    const entries = useMemo(() => {
        if (tab === 'search') {
            return visibleEntries
        } else {
            return visibleEntries.filter(entry => entry.simpleBelt === tab)
        }
    }, [tab, visibleEntries])

    const footerBefore = (
        <div style={{margin:'30px 0px'}}>
            <ExportButton text={true}/>
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
                <InlineFilterDisplay profile={profile} collectionType={'locks'}/>

                {(tab !== 'search' && !isSearch && filterCount === 0 && entries.length !== 0) &&
                    <BeltRequirements belt={tab}/>}

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
            <Footer extras={footer} before={footerBefore}/>
        </React.Fragment>
    )
}

export default Entries
