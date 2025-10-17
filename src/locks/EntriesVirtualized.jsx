import React, {useState, useContext, useMemo, useCallback, useRef, useEffect} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import CompactEntries from './CompactEntries'
import Entry from '../entries/Entry'
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
import AdvancedFilters from '../filters/./AdvancedFilters.jsx'

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

    // Variable-size virtualization setup
    const listRef = useRef(null)
    const sizeMapRef = useRef({})
    const estimatedItemSize = 220

    const setSize = useCallback((index, size) => {
        const map = sizeMapRef.current
        if (map[index] !== size) {
            map[index] = size
            // Invalidate cached measurements after this index
            if (listRef.current && typeof listRef.current.resetAfterIndex === 'function') {
                listRef.current.resetAfterIndex(index, true)
            }
        }
    }, [])

    const getSize = useCallback((index) => {
        return sizeMapRef.current[index] || estimatedItemSize
    }, [])

    // When the entries list changes (filters, tab, etc.), clear cached sizes and reset list
    useEffect(() => {
        sizeMapRef.current = {}
        if (listRef.current && typeof listRef.current.resetAfterIndex === 'function') {
            listRef.current.resetAfterIndex(0, true)
        }
    }, [entries])

    const Row = useCallback(({index, style}) => {
        const entry = entries[index]
        // Measure actual height once rendered
        const measuredRef = (node) => {
            if (node) {
                const rect = node.getBoundingClientRect()
                const h = Math.ceil(rect.height)
                if (h && h > 0) setSize(index, h)
            }
        }
        return (
            <div style={style}>
                <div ref={measuredRef}>
                    <Entry
                        entry={entry}
                        expanded={entry.id === entryExpanded || !!expandAll}
                        onExpand={setEntryExpanded}
                    />
                </div>
            </div>
        )
    }, [entries, entryExpanded, expandAll, setEntryExpanded, setSize])

    return (
        <React.Fragment>
            <div style={{margin: 8, paddingBottom: 32}}>

                <AdvancedFilters/>

                {(tab !== 'search' && !isSearch && filterCount === 0 && entries.length !== 0) &&
                    <BeltRequirements belt={tab}/>}

                {entries.length === 0 && <NoEntriesCard label='Locks' isSearch={isSearch}/>}

                {compact ? (
                    <CompactEntries entries={entries}/>
                ) : (
                    entries.length > 0 && (
                        <div style={{height: 'calc(100vh - 20px)'}}>
                            <AutoSizer>
                                {({height, width}) => (
                                    <List
                                        ref={listRef}
                                        height={height}
                                        width={width}
                                        itemCount={entries.length}
                                        itemKey={(index) => entries[index]?.id ?? index}
                                        itemSize={getSize}
                                        estimatedItemSize={estimatedItemSize}
                                        overscanCount={5}
                                    >
                                        {Row}
                                    </List>
                                )}
                            </AutoSizer>
                        </div>
                    )
                )}
            </div>
            <Footer extras={footer} before={footerBefore}/>
        </React.Fragment>
    )
}

export default Entries
